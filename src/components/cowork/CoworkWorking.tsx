/**
 * CoworkWorking — the "agent is working" state for the Cowork mock surface.
 *
 * Mirrors Cowork's long-running, multi-step nature: a thin animated gradient bar
 * sits on top, a few Fluent shimmer skeleton lines stand in for streaming text,
 * and a vertical step list shows progress — completed steps get a check, the
 * active step a pulsing dot, pending steps read muted.
 *
 * Props:
 *  - steps: string[]        — ordered step labels
 *  - activeIndex: number    — index of the in-progress step; steps before it are
 *                             complete, steps after it are pending. Pass
 *                             steps.length to mark every step complete.
 *  - label?: string         — heading above the steps (default "Working on it…")
 *  - skeletonLines?: number — number of shimmer lines (default 3, clamped 0..6)
 *  - className?: string
 *
 * Register B (Cowork) tokens + font-fluent only. Heroicons 24px outline.
 * Reduced-motion-safe (shimmer / sweep / pulse are global, motion-gated utilities).
 */
import { CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

export type CoworkWorkingProps = {
  steps: string[];
  activeIndex: number;
  label?: string;
  skeletonLines?: number;
  className?: string;
};

type StepState = "done" | "active" | "pending";

function stepState(index: number, activeIndex: number): StepState {
  if (index < activeIndex) return "done";
  if (index === activeIndex) return "active";
  return "pending";
}

export function CoworkWorking({
  steps,
  activeIndex,
  label = "Working on it…",
  skeletonLines = 3,
  className,
}: CoworkWorkingProps) {
  const lineCount = Math.max(0, Math.min(skeletonLines, 6));
  // Varied widths so the shimmer reads as paragraph text, not bars.
  const widths = ["w-[92%]", "w-[78%]", "w-[85%]", "w-[64%]", "w-[88%]", "w-[71%]"];

  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-lg border border-cw-line bg-cw-surface shadow-cw",
        className,
      )}
    >
      <div className="cw-grad-bar h-0.5 w-full" aria-hidden="true" />
      <div className="flex flex-col gap-4 p-4">
        <p
          className="cw-grad-text font-fluent text-xs font-semibold"
          role="status"
          aria-live="polite"
        >
          {label}
        </p>

        {lineCount > 0 ? (
          <div className="flex flex-col gap-2" aria-hidden="true">
            {Array.from({ length: lineCount }).map((_, i) => (
              <span key={i} className={cn("cw-shimmer h-3", widths[i % widths.length])} />
            ))}
          </div>
        ) : null}

        {steps.length > 0 ? (
          <ol className="flex flex-col gap-2.5">
            {steps.map((step, index) => {
              const state = stepState(index, activeIndex);
              return (
                <li
                  key={`${index}-${step}`}
                  className="flex items-center gap-2.5 font-fluent text-sm"
                  aria-current={state === "active" ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                      state === "done" && "bg-cw-ok-tint text-cw-ok",
                      state === "active" && "bg-cw-brand-tint",
                      state === "pending" && "border border-cw-line bg-cw-bg",
                    )}
                    aria-hidden="true"
                  >
                    {state === "done" ? (
                      <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    ) : state === "active" ? (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cw-brand opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cw-brand" />
                      </span>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-cw-muted/40" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 break-words",
                      state === "done" && "text-cw-muted",
                      state === "active" && "font-medium text-cw-text",
                      state === "pending" && "text-cw-muted",
                    )}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
