"use client";

/**
 * /build — Module 2, the lab and centerpiece.
 *
 * A guided stepper that walks a non-technical learner through authoring a
 * two-file Cowork skill (SKILL.md + voice.md) for a chosen scenario, testing it
 * live against a real model in the test bench, and downloading the files ready
 * to install.
 *
 * State lives in an external store (`useWorkshopState`) that persists every
 * change to localStorage and restores it on load — so a refresh never loses
 * work — read via `useSyncExternalStore` (SSR-safe, no cascading mount effect).
 * SKILL.md / voice.md are assembled here once per render and threaded down so
 * previews, the validator, the test-bench request, and the downloads all
 * reflect exactly the same text.
 */
import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button, Stepper, type StepperItem } from "@/components/ui";
import {
  GoalStep,
  VoiceStep,
  SkillStep,
  TestBench,
  FinishStep,
} from "@/components/build";
import { assembleSkillMd, assembleVoiceMd, validateSkill } from "@/lib/skill";
import { useWorkshopState } from "@/lib/useWorkshopState";
import {
  getScenario,
  skillFieldsFromScenario,
  voiceFieldsFromScenario,
} from "@/lib/scenarios";
import {
  BUILD_STEPS,
  type BuildStepId,
  type LastResult,
} from "@/lib/types";

/** Human labels for the stepper rail (BUILD_STEPS order). */
const STEP_LABELS: Record<BuildStepId, string> = {
  goal: "Goal",
  voice: "Voice",
  skill: "Skill",
  test: "Test",
  finish: "Finish",
};

const STEPPER_ITEMS: StepperItem[] = BUILD_STEPS.map((id) => ({
  id,
  label: STEP_LABELS[id],
}));

function stepIndex(id: BuildStepId): number {
  return BUILD_STEPS.indexOf(id);
}

export default function BuildPage() {
  // `hydrated` is false on the server / first client paint (the store reports a
  // deterministic snapshot), then true once localStorage is read — surfaced via
  // useSyncExternalStore, so no mount effect / setState-in-effect is needed.
  const { state, hydrated, patch, patchSkill, patchVoice, replace, reset } =
    useWorkshopState();

  const topRef = useRef<HTMLDivElement>(null);

  /* ---------- Navigation reach ---------- */
  // How far the learner has been allowed to navigate. We only persist forward
  // growth from explicit navigation in state; the floor is always the restored
  // step (folded in at render time), so resuming mid-flow keeps earlier steps
  // reachable without a seeding effect.
  const currentIdx = stepIndex(state.step);
  const [reachGrowth, setReachGrowth] = useState(0);
  const maxReached = Math.max(reachGrowth, currentIdx);

  /* ---------- Derived: assembled files + validity ---------- */
  const skillMd = useMemo(() => assembleSkillMd(state.skill), [state.skill]);
  const voiceMd = useMemo(() => assembleVoiceMd(state.voice), [state.voice]);
  const skillFindings = useMemo(
    () => validateSkill({ skillMd, voiceMd }),
    [skillMd, voiceMd],
  );
  const skillHasErrors = skillFindings.some((f) => f.level === "error");

  /* ---------- Scenario / result handlers ---------- */
  const handlePickScenario = useCallback(
    (scenarioId: string) => {
      // Re-seed editable defaults from the chosen scenario, keeping the learner
      // on the goal step. Downstream work resets intentionally because the
      // whole scenario (draft, command, defaults) changed.
      const scenario = getScenario(scenarioId);
      replace({
        ...state,
        scenarioId: scenario.id,
        skill: skillFieldsFromScenario(scenario),
        voice: voiceFieldsFromScenario(scenario),
        draft: scenario.sampleDraft,
        instruction: scenario.sampleCommand,
        lastResult: null,
      });
    },
    [replace, state],
  );

  const handleResult = useCallback(
    (result: LastResult) => patch({ lastResult: result }),
    [patch],
  );

  /* ---------- Navigation ---------- */
  const current = state.step;

  const goToIndex = useCallback(
    (idx: number) => {
      const clamped = Math.min(Math.max(idx, 0), BUILD_STEPS.length - 1);
      patch({ step: BUILD_STEPS[clamped] });
      setReachGrowth((m) => Math.max(m, clamped));
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [patch],
  );

  const goNext = useCallback(
    () => goToIndex(currentIdx + 1),
    [goToIndex, currentIdx],
  );
  const goBack = useCallback(
    () => goToIndex(currentIdx - 1),
    [goToIndex, currentIdx],
  );

  const handleStepClick = useCallback(
    (id: string) => {
      const idx = stepIndex(id as BuildStepId);
      if (idx >= 0 && idx <= maxReached) goToIndex(idx);
    },
    [maxReached, goToIndex],
  );

  const handleStartOver = useCallback(() => {
    reset();
    setReachGrowth(0);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [reset]);

  // Block advancing into the test bench while the skill has hard errors — the
  // run would be unfair to the learner. Warnings never block.
  const nextBlocked = current === "skill" && skillHasErrors;
  const completedIds = BUILD_STEPS.filter((_, i) => i < currentIdx);

  /* ---------- Avoid hydration flicker ---------- */
  if (!hydrated) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded-control bg-surface-2" />
        <div className="mt-8 h-16 animate-pulse rounded-card bg-surface-2" />
        <div className="mt-8 h-64 animate-pulse rounded-card bg-surface-2" />
      </main>
    );
  }

  const isLast = current === "finish";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div ref={topRef} className="scroll-mt-6" />

      {/* Header + stepper */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-accent-700">
              Module 2 · Build
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-fg">
              Build a Cowork skill, then watch it run
            </h1>
          </div>
          <Link
            href="/learn"
            className="text-sm font-medium text-muted underline-offset-2 transition-colors hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            ← Back to Learn
          </Link>
        </div>

        <div className="rounded-card border border-line bg-surface p-4 shadow-card sm:p-5">
          <Stepper
            steps={STEPPER_ITEMS}
            currentId={current}
            completedIds={completedIds}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Step body */}
      <section className="mt-8" aria-live="polite">
        {current === "goal" && (
          <GoalStep scenarioId={state.scenarioId} onPick={handlePickScenario} />
        )}
        {current === "voice" && (
          <VoiceStep
            scenarioId={state.scenarioId}
            voice={state.voice}
            onChange={patchVoice}
          />
        )}
        {current === "skill" && (
          <SkillStep
            skill={state.skill}
            voice={state.voice}
            onChange={patchSkill}
          />
        )}
        {current === "test" && (
          <TestBench
            scenarioId={state.scenarioId}
            skill={state.skill}
            voice={state.voice}
            skillMd={skillMd}
            voiceMd={voiceMd}
            draft={state.draft}
            instruction={state.instruction}
            lastResult={state.lastResult}
            onDraftChange={(draft) => patch({ draft })}
            onInstructionChange={(instruction) => patch({ instruction })}
            onSkillChange={patchSkill}
            onVoiceChange={patchVoice}
            onResult={handleResult}
          />
        )}
        {current === "finish" && (
          <FinishStep
            skillMd={skillMd}
            voiceMd={voiceMd}
            didRun={!!state.lastResult}
            onStartOver={handleStartOver}
          />
        )}
      </section>

      {/* Footer nav */}
      {!isLast && (
        <nav className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={currentIdx === 0}
            className="sm:order-1"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>

          <div className="flex flex-col items-stretch gap-2 sm:order-2 sm:flex-row sm:items-center">
            {nextBlocked && (
              <p className="text-center text-xs text-error-600 sm:text-right">
                Fix the validator errors to continue.
              </p>
            )}
            <Button variant="primary" onClick={goNext} disabled={nextBlocked}>
              {current === "test" ? (
                <>
                  <CheckIcon className="h-4 w-4" aria-hidden="true" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </nav>
      )}
    </main>
  );
}
