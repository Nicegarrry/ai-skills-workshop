/**
 * Pure functions for assembling, parsing, validating, and running skills.
 *
 * All functions are dependency-free (except shared types) and deterministic,
 * making them straightforward to unit-test without mocking anything.
 */

import type { Finding, SkillFields, VoiceFields } from "@/lib/types";

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

/**
 * Build the full SKILL.md text from the learner's authored fields.
 *
 * Output format:
 * ```
 * ---
 * name: <name>
 * description: <description>
 * ---
 * <instructions>
 *
 * Reference file: voice.md
 * ```
 */
export function assembleSkillMd(input: SkillFields): string {
  const { name, instructions } = input;
  // Frontmatter scalars are single-line. The description field is a textarea, so
  // collapse any newlines the learner typed — otherwise the continuation lines
  // have no `key:` and parseFrontmatter would silently drop them, skewing the
  // live validator feedback.
  const description = input.description.replace(/\r?\n/g, " ").trim();
  const frontmatter = `---\nname: ${name}\ndescription: ${description}\n---`;
  const body = instructions.trim();

  // Append the voice.md reference line only when the body doesn't already
  // mention voice.md (avoids duplicate references during live preview edits).
  const voiceRef = body.includes("voice.md")
    ? ""
    : "\n\nReference file: voice.md";

  return `${frontmatter}\n${body}${voiceRef}`;
}

/**
 * Build the voice.md reference file from the learner's voice-capture inputs.
 *
 * Includes whichever fields are non-empty so a learner who only fills in the
 * tone description still gets a useful file.
 */
export function assembleVoiceMd(input: VoiceFields): string {
  const { sampleEmails, toneDescription } = input;
  const lines: string[] = ["# Voice reference"];

  if (toneDescription.trim()) {
    lines.push("", "## Tone", "", toneDescription.trim());
  }

  if (sampleEmails.trim()) {
    lines.push("", "## Sample writing", "", sampleEmails.trim());
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Minimal YAML-frontmatter reader.
 *
 * Handles the two scalar fields Cowork skills use (`name`, `description`).
 * No external dependency needed — we only parse key: value lines between the
 * opening and closing `---` delimiters.
 */
export function parseFrontmatter(md: string): {
  name?: string;
  description?: string;
  body: string;
} {
  const trimmed = md.trimStart();

  if (!trimmed.startsWith("---")) {
    return { body: md };
  }

  // Find the closing fence. Anchor on a newline so a `---` substring inside a
  // field value isn't mistaken for the closing delimiter.
  const closeIdx = trimmed.indexOf("\n---", 3);
  if (closeIdx === -1) {
    return { body: md };
  }

  const fmBlock = trimmed.slice(3, closeIdx);
  const body = trimmed.slice(closeIdx + 4).trimStart();

  let name: string | undefined;
  let description: string | undefined;

  for (const line of fmBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key === "name") name = value;
    else if (key === "description") description = value;
  }

  return { name, description, body };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** /^[a-z0-9]+(-[a-z0-9]+)*$/ — strict kebab-case */
const KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Trigger cues that hint Cowork when to load the skill.
 * We match case-insensitively so "Use when" / "use when" both pass.
 */
const TRIGGER_CUES = ["use when", "when the user", "when you", "when a user"];

const MAX_SKILL_BYTES = 1_000_000; // 1 MB per the Cowork limit
const MAX_LIBRARY_SIZE = 50; // 50 custom skills per the Cowork limit
const MIN_DESCRIPTION_WORDS = 8;

/**
 * Validate a skill against the Cowork authoring rules.
 *
 * Returns an array of `Finding` items — one per checked dimension — in a
 * stable order so the validator panel renders consistently.
 */
export function validateSkill(args: {
  skillMd: string;
  voiceMd: string;
  librarySize?: number;
}): Finding[] {
  const { skillMd, voiceMd, librarySize = 1 } = args;
  const findings: Finding[] = [];

  const { name, description, body } = parseFrontmatter(skillMd);

  // --- name ---
  if (!name) {
    findings.push({
      level: "error",
      field: "name",
      message: "Missing — add a kebab-case name in the frontmatter.",
    });
  } else if (!KEBAB_RE.test(name)) {
    findings.push({
      level: "error",
      field: "name",
      message: `"${name}" is not kebab-case. Use lowercase letters, digits, and hyphens only (e.g. email-in-my-voice).`,
    });
  } else {
    findings.push({
      level: "ok",
      field: "name",
      message: `"${name}" is a valid kebab-case skill name.`,
    });
  }

  // --- description ---
  if (!description) {
    findings.push({
      level: "error",
      field: "description",
      message:
        'Missing — add a description that starts with a trigger cue ("Use when…") so Cowork knows when to load this skill.',
    });
  } else {
    const wordCount = description.trim().split(/\s+/).length;
    const lower = description.toLowerCase();
    const hasTrigger = TRIGGER_CUES.some((cue) => lower.includes(cue));

    if (wordCount < MIN_DESCRIPTION_WORDS) {
      findings.push({
        level: "warn",
        field: "description",
        message: `Too short (${wordCount} words). Aim for ≥ ${MIN_DESCRIPTION_WORDS} words so Cowork can reliably match it to user tasks.`,
      });
    } else if (!hasTrigger) {
      findings.push({
        level: "warn",
        field: "description",
        message:
          'No trigger cue found. Start with "Use when…" or "When the user…" to teach Cowork when to auto-load this skill.',
      });
    } else {
      findings.push({
        level: "ok",
        field: "description",
        message: "Description has a trigger cue and enough detail for reliable auto-discovery.",
      });
    }
  }

  // --- body / voice.md reference ---
  const bodyText = body.trim();
  if (!bodyText) {
    findings.push({
      level: "error",
      field: "instructions",
      message: "Body is empty — add instructions that describe what Cowork should do.",
    });
  } else if (!bodyText.includes("voice.md") && !skillMd.includes("voice.md")) {
    findings.push({
      level: "warn",
      field: "instructions",
      message:
        'Instructions don\'t reference "voice.md". Add a reference so Cowork loads the voice file and applies your tone.',
    });
  } else {
    findings.push({
      level: "ok",
      field: "instructions",
      message: "Instructions are present and reference voice.md.",
    });
  }

  // --- total file size ---
  const totalBytes =
    new TextEncoder().encode(skillMd).length +
    new TextEncoder().encode(voiceMd).length;

  if (totalBytes >= MAX_SKILL_BYTES) {
    findings.push({
      level: "error",
      field: "size",
      message: `Combined skill files are ${(totalBytes / 1024).toFixed(0)} KB — over the 1 MB Cowork limit. Trim the instructions or voice samples.`,
    });
  } else {
    findings.push({
      level: "ok",
      field: "size",
      message: `File size is ${(totalBytes / 1024).toFixed(1)} KB — well within the 1 MB limit.`,
    });
  }

  // --- library size ---
  if (librarySize > MAX_LIBRARY_SIZE) {
    findings.push({
      level: "error",
      field: "library",
      message: `You have ${librarySize} skills — over the 50-skill Cowork limit. Remove or archive some before adding this one.`,
    });
  } else {
    findings.push({
      level: "ok",
      field: "library",
      message: `${librarySize} of ${MAX_LIBRARY_SIZE} skill slots used.`,
    });
  }

  return findings;
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

/**
 * Construct the system + user prompt pair that simulates Cowork loading and
 * applying the skill.
 *
 * The system prompt scopes the model to produce only the finished email —
 * limiting prompt-injection blast radius since the model has no tools.
 */
export function buildRunPrompt(args: {
  skillMd: string;
  voiceMd: string;
  draft: string;
  instruction: string;
  /** Soft word budget — when set, the model is asked to finish within it. */
  maxWords?: number;
}): { system: string; user: string } {
  const { skillMd, voiceMd, draft, instruction, maxWords } = args;

  const lengthGuidance =
    typeof maxWords === "number" && maxWords > 0
      ? `Keep the whole email to roughly ${maxWords} words or fewer. Always finish the message with a complete sign-off — never stop mid-sentence.`
      : null;

  const system = [
    "You are Microsoft 365 Copilot Cowork.",
    "",
    "The user has this skill installed:",
    "```",
    skillMd.trim() || "(no skill provided)",
    "```",
    "",
    "It references this voice.md file:",
    "```",
    voiceMd.trim() || "(no voice file provided)",
    "```",
    "",
    "Apply the skill faithfully to the user's request.",
    "Output only the finished email (subject line, body, sign-off) — no commentary, no preamble, no explanation.",
    ...(lengthGuidance ? [lengthGuidance] : []),
  ].join("\n");

  const user = [
    draft.trim() ? `Draft:\n${draft.trim()}` : "(no draft provided)",
    "",
    instruction.trim() ? instruction.trim() : "/skill apply",
  ].join("\n");

  return { system, user };
}

// ---------------------------------------------------------------------------
// Mock run
// ---------------------------------------------------------------------------

/**
 * Deterministic MOCK-mode transform used when no LLM key is configured.
 *
 * Produces an email-shaped output by:
 * 1. Extracting the skill name from the frontmatter (falls back to "your skill").
 * 2. Trimming and lightly cleaning the draft.
 * 3. Wrapping the cleaned draft with a greeting, tidy paragraphs, and a sign-off.
 *
 * This is intentionally simple and deterministic — same inputs always produce the
 * same output — so the test bench is visually useful even without a live key.
 */
export function mockRun(args: {
  skillMd: string;
  voiceMd: string;
  draft: string;
  instruction: string;
}): string {
  const { skillMd, draft } = args;

  const { name: skillName } = parseFrontmatter(skillMd);
  const displayName = skillName ?? "your skill";

  // Extract a rough "subject" from the draft — first ~60 chars, stripped of
  // informal openers like "hey so re the thing".
  const cleanedDraft = draft
    .trim()
    .replace(/^(hey|hi|ok|so|re:?|fyi)[,\s]*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  const subjectSeed = cleanedDraft.slice(0, 60).replace(/[^a-zA-Z0-9 ,.:'-]/g, "");
  const subject = subjectSeed
    ? `Subject: ${subjectSeed.trim()}${cleanedDraft.length > 60 ? "…" : ""}`
    : `Subject: (${displayName})`;

  // Break the draft into sentence-ish segments for rough paragraph shaping.
  const sentences = cleanedDraft
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const body =
    sentences.length > 0
      ? sentences.join(" ").replace(/\blmk\b/gi, "let me know").replace(/\btbh\b/gi, "to be honest").replace(/\bur\b/gi, "your")
      : cleanedDraft;

  return [
    `${subject}`,
    "",
    "Hi,",
    "",
    body,
    "",
    "Happy to chat further if helpful.",
    "",
    "Best,",
    "[Your name]",
    "",
    `— Applied via ${displayName} skill (demo mode — configure a model key for live results)`,
  ].join("\n");
}
