/**
 * GoalStep — step 1 of the lab.
 *
 * Frames the scenario and previews what the learner will walk away with, then
 * lets them pick which scenario to build (the flagship "email in my voice" plus
 * a secondary one that reuses the exact same machinery). Choosing a scenario
 * re-seeds the lab's editable defaults — handled by the parent via `onPick`.
 */
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  DocumentTextIcon,
  MicrophoneIcon,
  PlayCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { SCENARIOS, type Scenario } from "@/lib/scenarios";

export type GoalStepProps = {
  scenarioId: string;
  onPick: (scenarioId: string) => void;
};

const WALKAWAY: { Icon: typeof MicrophoneIcon; label: string }[] = [
  { Icon: MicrophoneIcon, label: "A voice.md that captures how you write" },
  { Icon: DocumentTextIcon, label: "A real SKILL.md Cowork can auto-discover" },
  { Icon: PlayCircleIcon, label: "A live test run applying your skill" },
  { Icon: ArrowDownTrayIcon, label: "Both files downloaded, ready to install" },
];

export function GoalStep({ scenarioId, onPick }: GoalStepProps) {
  const active = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Badge tone="accent">Step 1 · The goal</Badge>
        <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {active.title}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          {active.blurb} You&rsquo;ll author a two-file skill, then drop into a
          virtual test bench where a real model loads your skill and applies it —
          exactly how Cowork discovers and runs a custom skill from your OneDrive.
        </p>
      </div>

      <Card as="section" aria-label="What you'll walk away with">
        <CardHeader>
          <CardTitle>What you&rsquo;ll walk away with</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="grid gap-3 sm:grid-cols-2">
            {WALKAWAY.map(({ Icon, label }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-accent-50 text-accent-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-fg">{label}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-fg">
          Pick a scenario to build
        </legend>
        <p className="text-sm text-muted">
          The flagship is email. The second one proves the same skill pattern
          generalizes — every field stays editable once you choose.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SCENARIOS.map((scenario) => (
            <ScenarioOption
              key={scenario.id}
              scenario={scenario}
              selected={scenario.id === scenarioId}
              onSelect={() => onPick(scenario.id)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function ScenarioOption({
  scenario,
  selected,
  onSelect,
}: {
  scenario: Scenario;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col gap-1.5 rounded-card border bg-surface p-4 text-left shadow-card transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
        selected
          ? "border-accent-500 ring-2 ring-accent-200"
          : "border-line hover:border-line-strong hover:bg-surface-2",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-medium text-fg">
          {scenario.defaultSkillName}
        </span>
        {selected ? (
          <Badge tone="accent">Selected</Badge>
        ) : (
          <span className="text-xs font-medium text-muted opacity-0 transition-opacity group-hover:opacity-100">
            Choose
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-fg">{scenario.title}</span>
      <span className="text-sm leading-relaxed text-muted">
        {scenario.blurb}
      </span>
    </button>
  );
}
