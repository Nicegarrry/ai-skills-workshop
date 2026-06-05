"use client";

/**
 * TestBench — step 4 of the lab and the payoff.
 *
 * The run experience is staged INSIDE a CoworkFrame so it reads as the real
 * Microsoft 365 Copilot Cowork product (register B — Fluent 2), while the
 * authoring controls stay in the warm SapphireOS register A on the left.
 *
 * Left (register A): the rough draft is an editable input ("the rough draft
 * Cowork is working from"), plus a collapsible "Tweak the skill" editor for
 * description / instructions / tone so the learner can edit and re-run.
 *
 * Right (register B — the CoworkFrame): the slash instruction is typed into the
 * Cowork composer ("invoke your skill"). On Run, the learner's instruction
 * appears as a user turn, then a CoworkWorking step list advances on a short
 * timer (always visible, even in MOCK mode), and finally the result lands as an
 * assistant turn — a "Cowork loaded <skill> (matched your description) → applied
 * voice.md" trace line, a CoworkStatusChip, and the finished email rendered as
 * readable, wrapping prose (NOT a horizontally-scrolling code pane).
 *
 * Networking: POST /api/run-skill with { skillMd, voiceMd, draft, instruction,
 * scenarioId } — request shape unchanged. SKILL.md / voice.md are assembled from
 * the current fields by the parent and passed in, so the request always reflects
 * the latest edits. The result is mode-labelled ("Demo mode" vs "Live"); MOCK
 * carries a subtle note + the demo callout. Loading + error states preserved.
 */
import { useCallback, useEffect, useRef, useState, useLayoutEffect, type RefObject } from "react";
import { Callout, Field, TextField } from "@/components/ui";
import {
  CoworkFrame,
  CoworkMessage,
  CoworkStatusChip,
  CoworkWorking,
  CoworkComposer,
  Sparkle,
} from "@/components/cowork";
import { cn } from "@/lib/cn";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { parseFrontmatter } from "@/lib/skill";
import type {
  LastResult,
  RunSkillRequest,
  RunSkillResponse,
  SkillFields,
  VoiceFields,
} from "@/lib/types";

export type TestBenchProps = {
  scenarioId: string;
  skill: SkillFields;
  voice: VoiceFields;
  skillMd: string;
  voiceMd: string;
  draft: string;
  instruction: string;
  lastResult: LastResult | null;
  onDraftChange: (value: string) => void;
  onInstructionChange: (value: string) => void;
  onSkillChange: (patch: Partial<SkillFields>) => void;
  onVoiceChange: (patch: Partial<VoiceFields>) => void;
  onResult: (result: LastResult) => void;
};

/** The discovery trace shown while Cowork "works" — mirrors the discovery model
 *  (find skill → load it → read its files → apply → write). Always animated so
 *  the run reads as the agentic, multi-step product, even in MOCK mode. */
function buildWorkingSteps(skillName: string): string[] {
  return [
    "Discovering skills…",
    `Matched ${skillName}`,
    "Reading voice.md",
    "Applying your skill",
    "Drafting the email",
  ];
}

/** Total time the working animation is on screen, spread across the 5 steps.
 *  Kept short (~2s) so it's lively but never tedious; clamped so the reveal is
 *  always gated behind a complete pass of the step list. */
const STEP_INTERVAL_MS = 420;

export function TestBench({
  scenarioId,
  skill,
  voice,
  skillMd,
  voiceMd,
  draft,
  instruction,
  lastResult,
  onDraftChange,
  onInstructionChange,
  onSkillChange,
  onVoiceChange,
  onResult,
}: TestBenchProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorsOpen, setEditorsOpen] = useState(false);

  // Animation state. `activeStep` walks the working-step list while a run is in
  // flight; the result is only revealed once the animation has finished a full
  // pass AND the network has returned (whichever is later) — so the multi-step
  // "agent at work" moment is always seen, even when MOCK returns instantly.
  const [activeStep, setActiveStep] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const animDoneRef = useRef(false);
  // The network result, held in a ref so the timer callback can read the latest
  // value and reveal it on the final animation tick (no second effect / no
  // synchronous setState-in-effect cascade).
  const pendingResultRef = useRef<LastResult | null>(null);

  // Ref for the result block so we can scroll it into view after it lands.
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Track the previous result timestamp so auto-scroll only fires on a genuinely
  // NEW result — not on mount/return with a persisted result from localStorage.
  const prevAtRef = useRef<number | null>(null);

  // The discovery name shown in the working steps + trace line — parsed from the
  // actual SKILL.md frontmatter so it always matches what the model received.
  const loadedName = parseFrontmatter(skillMd).name?.trim() || skill.name || "your-skill";
  const steps = buildWorkingSteps(loadedName);
  const stepCount = steps.length;

  // Reveal a finished run: hand it to the parent and clear the loading state.
  // Stable across renders so the timer effect's dep list stays tight.
  const reveal = useCallback(
    (result: LastResult) => {
      onResult(result);
      pendingResultRef.current = null;
      setLoading(false);
    },
    [onResult],
  );

  /* ---------- Working-step animation ---------- */
  // While loading, advance `activeStep` on a timer. The advance happens in the
  // timeout callback (NOT the effect body), so it doesn't cascade renders. On
  // the final tick we mark the animation done and, if the network has already
  // returned, reveal the stashed result.
  useEffect(() => {
    if (!loading) return;
    if (activeStep >= stepCount) return;

    const id = window.setTimeout(() => {
      const next = activeStep + 1;
      setActiveStep(next);
      if (next >= stepCount) {
        animDoneRef.current = true;
        const result = pendingResultRef.current;
        if (result) reveal(result);
      }
    }, STEP_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [loading, activeStep, stepCount, reveal]);

  // Abort any in-flight request on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Scroll the result into view when a genuinely NEW result lands.
  // Gate: only fires when `lastResult.at` changes from a prior non-null value —
  // skips the initial mount/return with a persisted result (prevAtRef is null on
  // first render, so we record the existing timestamp without scrolling).
  // Uses scrollTop on the transcript container rather than scrollIntoView so that
  // only the internal overflow-y-auto container scrolls, not the page/window.
  useLayoutEffect(() => {
    const currentAt = lastResult?.at ?? null;
    const previousAt = prevAtRef.current;

    if (previousAt !== null && currentAt !== null && currentAt !== previousAt) {
      // A new result arrived after a prior one was already shown — scroll the
      // result div into view within its nearest scrollable ancestor only.
      if (resultRef.current) {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const scrollable = resultRef.current.closest<HTMLElement>(
          "[data-transcript-scroll]",
        );
        if (scrollable) {
          scrollable.scrollTo({
            top: scrollable.scrollHeight,
            behavior: mq.matches ? "instant" : "smooth",
          });
        } else {
          // Fallback: scrollIntoView with block:nearest keeps page movement minimal.
          resultRef.current.scrollIntoView({
            behavior: mq.matches ? "instant" : "smooth",
            block: "nearest",
          });
        }
      }
    }

    prevAtRef.current = currentAt;
  }, [lastResult]);

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Reset the animation for this run and start it from the top.
    animDoneRef.current = false;
    pendingResultRef.current = null;
    setActiveStep(0);
    setLoading(true);
    setError(null);

    try {
      const body: RunSkillRequest = {
        skillMd,
        voiceMd,
        draft,
        instruction,
        scenarioId,
      };
      const res = await fetch("/api/run-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      let data: RunSkillResponse;
      try {
        data = (await res.json()) as RunSkillResponse;
      } catch {
        throw new Error(
          res.status === 429
            ? "You've run this a lot in a short window — give it a minute and try again."
            : `The run failed (HTTP ${res.status}). Try again in a moment.`,
        );
      }

      if (!data.ok) {
        throw new Error(data.error || "The run failed. Try again in a moment.");
      }

      const result: LastResult = {
        output: data.output,
        mode: data.mode,
        model: data.model,
        at: Date.now(),
      };

      // Gate the reveal behind the working animation so the agentic moment is
      // always seen — if the animation has already finished, reveal now;
      // otherwise stash it in the ref for the final animation tick to flush.
      if (animDoneRef.current) {
        reveal(result);
      } else {
        pendingResultRef.current = result;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong running your skill.",
      );
      setLoading(false);
      pendingResultRef.current = null;
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, [skillMd, voiceMd, draft, instruction, scenarioId, reveal]);

  const hasRun = !!lastResult;
  const showComposerSubmit = useCallback(() => void run(), [run]);

  return (
    <div className="flex animate-fade-up flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">Step 4 · Test bench</p>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Watch your skill run
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Here&rsquo;s a messy draft. On the right is a stand-in for{" "}
          <span className="font-medium text-fg">Cowork</span> — describe what you
          want like you would to your AI coworker, and run it. Cowork discovers
          your skill, reads <code className="font-mono">voice.md</code>, and
          returns a finished result. Don&rsquo;t love it? Tweak the skill and run
          again.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---------- Left: authoring (register A) ---------- */}
        <div className="flex flex-col gap-5">
          <TextField
            label="The rough draft Cowork is working from"
            hint="This is the messy input handed to your skill. Edit it freely."
            rows={9}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            spellCheck={false}
            className="font-mono text-[13px]"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setEditorsOpen((v) => !v)}
              aria-expanded={editorsOpen}
              aria-controls="tweak-editors"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 transition-transform",
                  editorsOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
              Tweak the skill
            </button>
            {hasRun && (
              <p className="text-xs text-muted">
                Edit, then send the command again to compare.
              </p>
            )}
          </div>

          {editorsOpen && (
            <div
              id="tweak-editors"
              className="flex flex-col gap-5 rounded-card border border-line bg-surface-2 p-4"
            >
              <p className="text-xs leading-relaxed text-muted">
                Adjust the voice or the instructions, then run again to compare.
                These edits update the same SKILL.md / voice.md you&rsquo;ll
                download.
              </p>
              <Field
                label="description"
                hint="Discovery text — what makes Cowork load this skill."
                value={skill.description}
                onChange={(e) => onSkillChange({ description: e.target.value })}
                spellCheck={false}
              />
              <TextField
                label="instructions"
                rows={6}
                value={skill.instructions}
                onChange={(e) =>
                  onSkillChange({ instructions: e.target.value })
                }
                spellCheck={false}
                className="font-mono text-[13px]"
              />
              <TextField
                label="tone (voice.md)"
                rows={2}
                value={voice.toneDescription}
                onChange={(e) =>
                  onVoiceChange({ toneDescription: e.target.value })
                }
              />
            </div>
          )}

          <p className="text-xs leading-relaxed text-muted">
            In real Cowork you&rsquo;d just describe the task — discovery picks
            the skill for you. The composer on the right makes the
            &ldquo;invoke&rdquo; explicit for the demo.
          </p>
        </div>

        {/* ---------- Right: the Cowork mock surface (register B) ---------- */}
        {/* aria-live announces the result; the transcript is the run's story. */}
        <div
          className="flex flex-col gap-3 lg:sticky lg:top-6 lg:self-start"
          aria-live="polite"
          aria-atomic="false"
        >
          <CoworkFrame
            className="min-h-[26rem] lg:h-[calc(100vh-7rem)] lg:max-h-[56rem]"
            headerAside={
              loading ? (
                <CoworkStatusChip variant="in-progress" />
              ) : lastResult ? (
                <CoworkStatusChip variant="done" />
              ) : error ? (
                <CoworkStatusChip variant="failed" />
              ) : undefined
            }
            composer={
              <CoworkComposer
                value={instruction}
                onChange={onInstructionChange}
                onSubmit={showComposerSubmit}
                placeholder="/skill polish this for my Monday update"
                loading={loading}
              />
            }
          >
            <CoworkTranscript
              instruction={instruction}
              steps={steps}
              activeStep={activeStep}
              loading={loading}
              error={error}
              result={lastResult}
              loadedName={loadedName}
              hasRun={hasRun}
              onRetry={() => void run()}
              resultRef={resultRef}
            />
          </CoworkFrame>

          {/* A subtle register-A note that this surface is a stand-in, plus the
              demo-mode callout when the latest result came from MOCK. */}
          <p className="text-center text-xs text-muted">
            A stand-in for Microsoft 365 Copilot Cowork, for the workshop.
          </p>
          {lastResult?.mode === "mock" && !loading && (
            <Callout tone="info">
              Demo mode — configure a model key for live results. The output above
              came from a deterministic local transform so the bench works with no
              key.
            </Callout>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- The Cowork chat transcript (the run's story) ---------- */

function CoworkTranscript({
  instruction,
  steps,
  activeStep,
  loading,
  error,
  result,
  loadedName,
  hasRun,
  onRetry,
  resultRef,
}: {
  instruction: string;
  steps: string[];
  activeStep: number;
  loading: boolean;
  error: string | null;
  result: LastResult | null;
  loadedName: string;
  hasRun: boolean;
  onRetry: () => void;
  resultRef: RefObject<HTMLDivElement | null>;
}) {
  const trimmedInstruction = instruction.trim();

  // Empty state — nothing run yet and nothing in flight.
  if (!loading && !error && !result) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 py-8 text-center">
        <Sparkle size={28} animated />
        <p className="font-fluent text-sm font-medium text-cw-text">
          Ready when you are
        </p>
        <p className="max-w-xs font-fluent text-xs leading-relaxed text-cw-muted">
          Type a request below — like{" "}
          <span className="font-medium text-cw-text">
            &ldquo;polish this for my Monday update&rdquo;
          </span>{" "}
          — and send it. Cowork will discover your skill and apply it.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* The user's request, echoed as a Cowork turn */}
      {trimmedInstruction && (
        <CoworkMessage role="user">{trimmedInstruction}</CoworkMessage>
      )}

      {/* In-flight: the agentic working state with the advancing step list */}
      {loading && (
        <CoworkWorking
          steps={steps}
          activeIndex={activeStep}
          label="Working on it…"
          skeletonLines={3}
        />
      )}

      {/* Error: surfaced as a Fluent-styled assistant turn with a retry */}
      {!loading && error && (
        <CoworkMessage role="assistant">
          <div className="flex flex-col gap-2.5">
            <span className="inline-flex items-center gap-1.5 font-medium text-cw-err">
              <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
              Couldn&rsquo;t complete the run
            </span>
            <span className="text-cw-muted">{error}</span>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex w-fit items-center gap-1.5 rounded-control bg-cw-brand-tint px-3 py-1.5 text-xs font-semibold text-cw-brand transition-colors hover:bg-cw-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cw-brand"
            >
              <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
          </div>
        </CoworkMessage>
      )}

      {/* Result: the finished email as a readable, wrapping assistant turn */}
      {!loading && !error && result && (
        <CoworkResult result={result} loadedName={loadedName} hasRun={hasRun} containerRef={resultRef} />
      )}
    </>
  );
}

/* ---------- The finished email, as a Cowork assistant turn ---------- */

function CoworkResult({
  result,
  loadedName,
  hasRun,
  containerRef,
}: {
  result: LastResult;
  loadedName: string;
  hasRun: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const isMock = result.mode === "mock";

  return (
    <CoworkMessage role="assistant">
      <div ref={containerRef} className="flex flex-col gap-3">
        {/* Discovery trace + run status — reinforces the discovery model */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-cw-muted">
          <span>Loaded</span>
          <span className="font-mono font-medium text-cw-text">
            {loadedName}
          </span>
          <span>(matched your description)</span>
          <span aria-hidden="true">→</span>
          <span>
            applied <span className="font-mono">voice.md</span>
          </span>
          {isMock ? (
            <CoworkStatusChip
              variant="needs"
              label="Demo mode"
              className="ml-1"
            />
          ) : (
            <CoworkStatusChip
              variant="done"
              label={result.model ? `Live · ${result.model}` : "Live"}
              className="ml-1"
            />
          )}
        </div>

        {/* The finished email — readable prose that WRAPS (no horizontal
            scroll). The CoworkMessage body already applies whitespace-pre-wrap
            + break-words; this just sets the column to a comfortable measure. */}
        <div className="max-w-prose font-fluent text-sm leading-relaxed text-cw-text">
          {result.output}
        </div>

        {isMock && (
          <p className="text-xs leading-relaxed text-cw-muted">
            Demo mode — this came from a deterministic local transform so the
            bench works with no model key. Configure a key for live results.
          </p>
        )}

        {hasRun && (
          <p className="text-xs text-cw-muted">
            Not quite it? Edit the skill on the left and send the command again.
          </p>
        )}
      </div>
    </CoworkMessage>
  );
}
