/**
 * Shared types for the AI Skills Workshop.
 *
 * These are the contract between the lab UI, the pure functions in `skill.ts`,
 * the scenario data, the persisted `WorkshopState`, and the `/api/run-skill`
 * route. Keep this dependency-free.
 */

/** Fields the learner authors for the `SKILL.md` file. */
export type SkillFields = {
  /** kebab-case skill name, e.g. "email-in-my-voice". Also the OneDrive folder. */
  name: string;
  /** The discovery description — must start with a trigger cue ("Use when…"). */
  description: string;
  /** The body/instructions of the skill; should reference `voice.md`. */
  instructions: string;
};

/** Fields the learner provides to assemble the `voice.md` reference file. */
export type VoiceFields = {
  /** One or two real emails the learner has written (raw paste). */
  sampleEmails: string;
  /** A one-sentence tone description, e.g. "warm, concise, no jargon". */
  toneDescription: string;
};

/** Severity for a single validator row. */
export type FindingLevel = "ok" | "warn" | "error";

/** One result row from `validateSkill` (or any validator surface). */
export type Finding = {
  level: FindingLevel;
  /** The field/aspect this finding is about, e.g. "name" or "description". */
  field: string;
  /** Human-readable explanation shown next to the icon. */
  message: string;
};

/** The mode the test-bench result was produced in. */
export type RunMode = "live" | "mock";

/** Successful run-skill response shape. */
export type RunSkillSuccess = {
  ok: true;
  output: string;
  mode: RunMode;
  /** Present only for live runs. */
  model?: string;
};

/** Failed run-skill response shape. */
export type RunSkillError = {
  ok: false;
  error: string;
};

export type RunSkillResponse = RunSkillSuccess | RunSkillError;

/**
 * Response-length budget (words) for the generated email.
 *
 * Sent in the run-skill request so the model is told to finish within the
 * budget — keeps the email a sensible length AND lets the route size its token
 * headroom from it, so the response is never hard-truncated mid-sentence.
 */
export const DEFAULT_MAX_WORDS = 250;
export const MIN_MAX_WORDS = 50;
export const MAX_MAX_WORDS = 600;

/** Request body for `POST /api/run-skill`. */
export type RunSkillRequest = {
  skillMd: string;
  voiceMd: string;
  draft: string;
  instruction: string;
  scenarioId?: string;
  /** Soft word budget for the generated email. Defaults to DEFAULT_MAX_WORDS. */
  maxWords?: number;
};

/** The result last seen in the test bench (persisted so a refresh restores it). */
export type LastResult = {
  output: string;
  mode: RunMode;
  model?: string;
  /** epoch ms when the run completed. */
  at: number;
};

/** Ordered build-lab steps. Index in this list drives the stepper. */
export const BUILD_STEPS = [
  "goal",
  "voice",
  "skill",
  "test",
  "finish",
] as const;

export type BuildStepId = (typeof BUILD_STEPS)[number];

/**
 * The lab's persisted state. Saved to localStorage on every change and restored
 * on load so a visitor can refresh and resume (see `storage.ts`).
 */
export type WorkshopState = {
  /** Schema version — bumped if the shape changes so stale state can be dropped. */
  version: number;
  /** Which step the learner is on. */
  step: BuildStepId;
  /** The scenario the lab is configured for. */
  scenarioId: string;
  /** SKILL.md authoring fields. */
  skill: SkillFields;
  /** voice.md authoring fields. */
  voice: VoiceFields;
  /** The (editable) messy draft in the test bench. */
  draft: string;
  /** The (editable) slash-command instruction in the test bench. */
  instruction: string;
  /** Soft word budget for the generated email (test-bench length control). */
  maxWords: number;
  /** The most recent test-bench result, if any. */
  lastResult: LastResult | null;
};
