/**
 * Stepper — horizontal progress indicator for the build lab.
 *
 * Props:
 *  - steps: StepperItem[]   — ordered { id, label }
 *  - currentId: string      — the active step's id
 *  - onStepClick?: (id) => void — if provided, completed/visited steps are clickable
 *  - completedIds?: string[]    — explicit completed set (defaults to all before current)
 *  - className?: string
 *
 * Renders a numbered rail: completed = filled accent + check, current = ring,
 * upcoming = muted. Token-driven; keyboard-accessible buttons when clickable.
 */
import { CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

export type StepperItem = { id: string; label: string };

export type StepperProps = {
  steps: StepperItem[];
  currentId: string;
  onStepClick?: (id: string) => void;
  completedIds?: string[];
  className?: string;
};

export function Stepper({
  steps,
  currentId,
  onStepClick,
  completedIds,
  className,
}: StepperProps) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === currentId),
  );

  const isCompleted = (index: number, id: string) =>
    completedIds ? completedIds.includes(id) : index < currentIndex;

  const currentStep = steps[currentIndex];

  return (
    <nav aria-label="Progress" className={cn("w-full min-w-0", className)}>
      {/* Dot rail — horizontally scrollable on phones so it never blows the page */}
      <div className="-my-1 overflow-x-auto py-1">
        <ol className="flex min-w-0 items-center">
          {steps.map((step, index) => {
            const completed = isCompleted(index, step.id);
            const current = step.id === currentId;
            const clickable = !!onStepClick && (completed || current);

            const dot = (
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border text-sm font-semibold transition-colors",
                  completed && "border-accent-600 bg-accent-600 text-white",
                  current &&
                    "border-accent-600 bg-surface text-accent-700 ring-4 ring-accent-100",
                  !completed &&
                    !current &&
                    "border-line-strong bg-surface text-muted",
                )}
              >
                {completed ? (
                  <CheckIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
            );

            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center",
                  index < steps.length - 1 && "flex-1",
                )}
              >
                <div className="flex items-center gap-2.5">
                  {clickable ? (
                    <button
                      type="button"
                      onClick={() => onStepClick?.(step.id)}
                      aria-current={current ? "step" : undefined}
                      className="flex items-center gap-2.5 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                    >
                      {dot}
                      <StepLabel label={step.label} active={current || completed} />
                    </button>
                  ) : (
                    <div
                      className="flex items-center gap-2.5"
                      aria-current={current ? "step" : undefined}
                    >
                      {dot}
                      <StepLabel label={step.label} active={current} />
                    </div>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mx-3 hidden h-px flex-1 sm:block",
                      completed ? "bg-accent-400" : "bg-line",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Current step label — shown only on phones (< sm) below the dot rail */}
      {currentStep && (
        <p className="mt-2 text-center text-sm font-medium text-fg sm:hidden">
          {currentStep.label}
        </p>
      )}
    </nav>
  );
}

function StepLabel({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={cn(
        "hidden text-sm font-medium sm:inline",
        active ? "text-fg" : "text-muted",
      )}
    >
      {label}
    </span>
  );
}
