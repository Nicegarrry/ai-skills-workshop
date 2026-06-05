/**
 * POST /api/run-skill
 *
 * The single server surface for the AI Skills Workshop. It:
 *   1. Validates + size-caps the request body (Zod).
 *   2. Applies a best-effort per-IP token-bucket rate limit.
 *   3. Selects a provider from env (Anthropic → Google → MOCK).
 *   4. Builds the prompt via buildRunPrompt and calls generateText.
 *   5. Returns { ok, output, mode, model? } — never leaks keys or stack traces.
 *
 * Security note: skillMd, voiceMd, draft, and instruction are user-supplied free
 * text forwarded to the model. The model has no tools and the output returns only
 * to the same user, so prompt-injection blast radius is contained. The system
 * prompt is scoped to "produce the finished email only" as an extra constraint.
 */

import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { buildRunPrompt, mockRun } from "@/lib/skill";
import type { RunSkillResponse } from "@/lib/types";

// ---------------------------------------------------------------------------
// Vercel function timeout
// ---------------------------------------------------------------------------
export const maxDuration = 30;

// ---------------------------------------------------------------------------
// Request schema + size caps (§9)
// ---------------------------------------------------------------------------

const MAX_SKILL_CHARS = 8 * 1024; // 8 KB in chars (UTF-8 chars ≈ bytes for ASCII)
const MAX_VOICE_CHARS = 8 * 1024;
const MAX_DRAFT_CHARS = 8 * 1024;
const MAX_INSTRUCTION_CHARS = 1024;

const RunSkillBodySchema = z.object({
  skillMd: z
    .string()
    .max(MAX_SKILL_CHARS, "skillMd exceeds 8 KB limit"),
  voiceMd: z
    .string()
    .max(MAX_VOICE_CHARS, "voiceMd exceeds 8 KB limit"),
  draft: z
    .string()
    .max(MAX_DRAFT_CHARS, "draft exceeds 8 KB limit"),
  instruction: z
    .string()
    .max(MAX_INSTRUCTION_CHARS, "instruction exceeds 1 KB limit"),
  scenarioId: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Per-IP token-bucket rate limiter (in-memory; best-effort only)
//
// Note: this is process-local and resets on cold starts. For durable rate
// limiting across Vercel serverless instances, a KV store (e.g. Vercel KV /
// Upstash Redis) is needed — out of scope for v1.
// ---------------------------------------------------------------------------

const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT = 10; // requests per window

interface Bucket {
  count: number;
  windowStart: number;
}

const ipBuckets = new Map<string, Bucket>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);

  if (!bucket || now - bucket.windowStart >= RATE_WINDOW_MS) {
    // New window
    ipBuckets.set(ip, { count: 1, windowStart: now });
    return true; // allowed
  }

  if (bucket.count >= RATE_LIMIT) {
    return false; // denied
  }

  bucket.count += 1;
  return true; // allowed
}

// Prune stale entries occasionally to prevent unbounded growth.
let lastPrune = Date.now();
function maybePruneBuckets(): void {
  const now = Date.now();
  if (now - lastPrune < RATE_WINDOW_MS) return;
  lastPrune = now;
  for (const [ip, bucket] of ipBuckets.entries()) {
    if (now - bucket.windowStart >= RATE_WINDOW_MS) {
      ipBuckets.delete(ip);
    }
  }
}

// ---------------------------------------------------------------------------
// Provider selection
// ---------------------------------------------------------------------------

type ProviderMode = "anthropic" | "google" | "mock";

function selectProvider(): ProviderMode {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "google";
  return "mock";
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<Response> {
  // --- rate limit ---
  maybePruneBuckets();
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = (forwarded ? forwarded.split(",")[0] : "unknown").trim();

  if (!checkRateLimit(ip)) {
    return Response.json(
      {
        ok: false,
        error:
          "Too many requests. You can run up to 10 skill tests per 5 minutes. Please wait a moment and try again.",
      } satisfies RunSkillResponse,
      { status: 429 },
    );
  }

  // --- parse + validate body ---
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON in request body." } satisfies RunSkillResponse,
      { status: 400 },
    );
  }

  const parsed = RunSkillBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request body.";
    return Response.json(
      { ok: false, error: message } satisfies RunSkillResponse,
      { status: 400 },
    );
  }

  const { skillMd, voiceMd, draft, instruction } = parsed.data;

  // --- build prompt ---
  const { system, user } = buildRunPrompt({ skillMd, voiceMd, draft, instruction });

  // --- provider dispatch ---
  const mode = selectProvider();

  if (mode === "mock") {
    const output = mockRun({ skillMd, voiceMd, draft, instruction });
    return Response.json({ ok: true, output, mode: "mock" } satisfies RunSkillResponse);
  }

  // Live LLM call.
  // AI SDK v6: generateText uses `maxOutputTokens` (renamed from `maxTokens` in v5→v6).
  // Provider default instances read the API key from env automatically:
  //   anthropic → ANTHROPIC_API_KEY
  //   google    → GOOGLE_GENERATIVE_AI_API_KEY
  try {
    const modelId =
      process.env.WORKSHOP_MODEL ??
      (mode === "anthropic" ? "claude-sonnet-4-6" : "gemini-2.5-flash");

    const model =
      mode === "anthropic" ? anthropic(modelId) : google(modelId);

    const result = await generateText({
      model,
      system,
      prompt: user,
      maxOutputTokens: 700,
      temperature: 0.3,
    });

    return Response.json({
      ok: true,
      output: result.text,
      mode: "live",
      model: modelId,
    } satisfies RunSkillResponse);
  } catch (err) {
    // Never leak stack traces or key details — log a sanitised message server-side.
    const safeMessage =
      err instanceof Error && !err.message.includes(process.env.ANTHROPIC_API_KEY ?? "__NEVER__")
        ? err.message
        : "LLM call failed.";

    console.error("[run-skill] generateText error:", safeMessage);

    return Response.json(
      { ok: false, error: "The AI model returned an error. Please try again." } satisfies RunSkillResponse,
      { status: 502 },
    );
  }
}
