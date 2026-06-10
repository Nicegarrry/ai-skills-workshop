import {
  BUILD_STEPS,
  DEFAULT_MAX_WORDS,
  MAX_MAX_WORDS,
  MIN_MAX_WORDS,
  type BuildStepId,
  type WorkshopState,
} from "@/lib/types";
import {
  DEFAULT_SCENARIO_ID,
  getScenario,
  skillFieldsFromScenario,
  voiceFieldsFromScenario,
} from "@/lib/scenarios";

/**
 * Typed localStorage persistence for the build lab's `WorkshopState`.
 *
 * Everything here is SSR-safe: with no `window` (server render / build) the
 * load returns a fresh default and save/clear are no-ops, so the lab can call
 * these freely during the first client render without guarding each call.
 */

const STORAGE_KEY = "ai-skills-workshop:state";

/** Bump when `WorkshopState` shape changes — older stored state is discarded. */
export const STATE_VERSION = 1;

function hasWindow(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/** A fresh state seeded from the given scenario (defaults to the flagship). */
export function createInitialState(
  scenarioId: string = DEFAULT_SCENARIO_ID,
): WorkshopState {
  const scenario = getScenario(scenarioId);
  return {
    version: STATE_VERSION,
    step: BUILD_STEPS[0],
    scenarioId: scenario.id,
    skill: skillFieldsFromScenario(scenario),
    voice: voiceFieldsFromScenario(scenario),
    draft: scenario.sampleDraft,
    instruction: scenario.sampleCommand,
    maxWords: DEFAULT_MAX_WORDS,
    lastResult: null,
  };
}

function isBuildStep(value: unknown): value is BuildStepId {
  return (
    typeof value === "string" &&
    (BUILD_STEPS as readonly string[]).includes(value)
  );
}

/**
 * Coerce arbitrary parsed JSON into a valid `WorkshopState`, repairing missing
 * or malformed fields against a scenario-seeded baseline. Returns null when the
 * input is unusable (wrong version / not an object) so the caller can reset.
 */
function coerceState(raw: unknown): WorkshopState | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  if (obj.version !== STATE_VERSION) return null;

  const scenarioId =
    typeof obj.scenarioId === "string" ? obj.scenarioId : DEFAULT_SCENARIO_ID;
  const base = createInitialState(scenarioId);

  const skill =
    typeof obj.skill === "object" && obj.skill !== null
      ? (obj.skill as Record<string, unknown>)
      : {};
  const voice =
    typeof obj.voice === "object" && obj.voice !== null
      ? (obj.voice as Record<string, unknown>)
      : {};

  const lastResult =
    typeof obj.lastResult === "object" &&
    obj.lastResult !== null &&
    typeof (obj.lastResult as Record<string, unknown>).output === "string"
      ? (obj.lastResult as WorkshopState["lastResult"])
      : null;

  return {
    version: STATE_VERSION,
    step: isBuildStep(obj.step) ? obj.step : base.step,
    scenarioId: base.scenarioId,
    skill: {
      name: typeof skill.name === "string" ? skill.name : base.skill.name,
      description:
        typeof skill.description === "string"
          ? skill.description
          : base.skill.description,
      instructions:
        typeof skill.instructions === "string"
          ? skill.instructions
          : base.skill.instructions,
    },
    voice: {
      sampleEmails:
        typeof voice.sampleEmails === "string"
          ? voice.sampleEmails
          : base.voice.sampleEmails,
      toneDescription:
        typeof voice.toneDescription === "string"
          ? voice.toneDescription
          : base.voice.toneDescription,
    },
    draft: typeof obj.draft === "string" ? obj.draft : base.draft,
    instruction:
      typeof obj.instruction === "string" ? obj.instruction : base.instruction,
    maxWords:
      typeof obj.maxWords === "number" &&
      Number.isFinite(obj.maxWords) &&
      obj.maxWords >= MIN_MAX_WORDS &&
      obj.maxWords <= MAX_MAX_WORDS
        ? Math.round(obj.maxWords)
        : base.maxWords,
    lastResult,
  };
}

/**
 * Load persisted state. Returns a fresh default when nothing is stored, the
 * stored value is corrupt, or `window` is unavailable. Never throws.
 */
export function loadState(): WorkshopState {
  if (!hasWindow()) return createInitialState();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return createInitialState();
    const coerced = coerceState(JSON.parse(stored));
    return coerced ?? createInitialState();
  } catch {
    return createInitialState();
  }
}

/** Persist state. No-op (and never throws) without `window` or on quota errors. */
export function saveState(state: WorkshopState): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full / disabled (private mode) — fail silently; the lab keeps
    // working from in-memory state for this session.
  }
}

/** Clear persisted state ("Start over"). No-op without `window`; never throws. */
export function clearState(): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
