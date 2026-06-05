/**
 * Build-lab barrel. The lab page (`src/app/build/page.tsx`) composes these step
 * components; each is responsible for one stepper stage and is driven entirely
 * by props + change callbacks from the page (which owns the persisted state).
 */
export { GoalStep, type GoalStepProps } from "./GoalStep";
export { VoiceStep, type VoiceStepProps } from "./VoiceStep";
export { SkillStep, type SkillStepProps } from "./SkillStep";
export { TestBench, type TestBenchProps } from "./TestBench";
export { FinishStep, type FinishStepProps } from "./FinishStep";
export { ValidatorPanel, type ValidatorPanelProps } from "./ValidatorPanel";
