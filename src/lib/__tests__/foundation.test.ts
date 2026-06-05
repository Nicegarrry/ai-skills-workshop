import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  SCENARIOS,
  DEFAULT_SCENARIO_ID,
  getScenario,
  skillFieldsFromScenario,
  voiceFieldsFromScenario,
} from "@/lib/scenarios";
import {
  createInitialState,
  loadState,
  saveState,
  clearState,
  STATE_VERSION,
} from "@/lib/storage";
import { BUILD_STEPS } from "@/lib/types";

/**
 * Foundation-spine sanity tests: scenario data integrity + SSR-safe storage
 * round-trip. The richer pure-function tests (skill.ts) belong to a feature
 * agent; these only guard the contracts this unit owns.
 */

describe("scenarios", () => {
  it("ships the flagship email scenario fully populated", () => {
    const email = getScenario("email-in-my-voice");
    expect(email.id).toBe("email-in-my-voice");
    expect(email.id).toBe(DEFAULT_SCENARIO_ID);
    expect(email.defaultSkillName).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    // instructions must reference voice.md (the lab teaches multi-file skills)
    expect(email.defaultInstructions).toContain("voice.md");
    // description must carry a trigger cue
    expect(email.defaultDescription.toLowerCase()).toContain("use when");
    expect(email.sampleDraft.length).toBeGreaterThan(20);
    expect(email.sampleCommand.startsWith("/")).toBe(true);
  });

  it("ships a second scenario reusing the same shape", () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(2);
    const second = getScenario("meeting-notes-to-actions");
    expect(second.id).toBe("meeting-notes-to-actions");
    expect(second.defaultInstructions).toContain("voice.md");
  });

  it("every scenario has unique ids and references voice.md", () => {
    const ids = new Set(SCENARIOS.map((s) => s.id));
    expect(ids.size).toBe(SCENARIOS.length);
    for (const s of SCENARIOS) {
      expect(s.defaultInstructions).toContain("voice.md");
      expect(s.defaultSkillName).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("falls back to the default scenario for unknown ids", () => {
    expect(getScenario("does-not-exist").id).toBe(DEFAULT_SCENARIO_ID);
    expect(getScenario(undefined).id).toBe(DEFAULT_SCENARIO_ID);
  });

  it("seeds editable fields from a scenario", () => {
    const sc = getScenario(DEFAULT_SCENARIO_ID);
    expect(skillFieldsFromScenario(sc)).toEqual({
      name: sc.defaultSkillName,
      description: sc.defaultDescription,
      instructions: sc.defaultInstructions,
    });
    expect(voiceFieldsFromScenario(sc)).toEqual({
      sampleEmails: sc.defaultSampleEmails,
      toneDescription: sc.defaultToneDescription,
    });
  });
});

describe("storage", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
      },
    });
  });

  it("createInitialState seeds from the default scenario", () => {
    const state = createInitialState();
    expect(state.version).toBe(STATE_VERSION);
    expect(state.step).toBe(BUILD_STEPS[0]);
    expect(state.scenarioId).toBe(DEFAULT_SCENARIO_ID);
    expect(state.skill.name).toBe(getScenario(DEFAULT_SCENARIO_ID).defaultSkillName);
    expect(state.lastResult).toBeNull();
  });

  it("round-trips through save/load", () => {
    const state = createInitialState();
    state.skill.name = "my-custom-skill";
    state.step = "test";
    state.lastResult = { output: "Hello", mode: "mock", at: 123 };
    saveState(state);

    const loaded = loadState();
    expect(loaded.skill.name).toBe("my-custom-skill");
    expect(loaded.step).toBe("test");
    expect(loaded.lastResult?.output).toBe("Hello");
  });

  it("loads a fresh default when nothing is stored", () => {
    const loaded = loadState();
    expect(loaded.skill.name).toBe(getScenario(DEFAULT_SCENARIO_ID).defaultSkillName);
  });

  it("repairs corrupt / partial stored state instead of throwing", () => {
    window.localStorage.setItem("ai-skills-workshop:state", "{ not json");
    expect(() => loadState()).not.toThrow();
    expect(loadState().version).toBe(STATE_VERSION);

    window.localStorage.setItem(
      "ai-skills-workshop:state",
      JSON.stringify({ version: STATE_VERSION, skill: { name: "kept" } }),
    );
    const repaired = loadState();
    expect(repaired.skill.name).toBe("kept");
    // missing fields filled from the baseline
    expect(repaired.skill.description.length).toBeGreaterThan(0);
    expect(repaired.step).toBe(BUILD_STEPS[0]);
  });

  it("drops state from an older schema version", () => {
    window.localStorage.setItem(
      "ai-skills-workshop:state",
      JSON.stringify({ version: STATE_VERSION - 1, skill: { name: "stale" } }),
    );
    expect(loadState().skill.name).not.toBe("stale");
  });

  it("clearState removes persisted state", () => {
    saveState(createInitialState());
    clearState();
    expect(window.localStorage.getItem("ai-skills-workshop:state")).toBeNull();
  });

  it("is SSR-safe: no window → default + no throw", () => {
    vi.stubGlobal("window", undefined);
    expect(() => saveState(createInitialState())).not.toThrow();
    expect(() => clearState()).not.toThrow();
    expect(loadState().version).toBe(STATE_VERSION);
  });
});
