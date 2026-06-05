"use client";

/**
 * DeckScreen — one `.snap-screen` in the LearnDeck presentation.
 *
 * Provides the shared slide shell: full-viewport (below the sticky Nav),
 * vertically centered, editorial max-width column, a per-slide eyebrow + slide
 * counter, and IN-VIEW animation gating. It publishes its in-view state through
 * ScreenInViewContext; children wrap their content in <Reveal> so each slide's
 * entrance animation plays as it arrives (not on first paint).
 *
 * Registers itself with the deck so the orchestrator's index/keyboard/rail
 * wiring stays declarative. Forwards its ref to the <section> the deck observes.
 */
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useDeck } from "./deck-context";
import { ScreenInViewContext } from "./Reveal";

export type DeckScreenProps = {
  /** Stable id — becomes the section DOM id + scroll anchor. */
  id: string;
  /** Short label (matches the progress rail). */
  label: string;
  /** Zero-based source-order index, supplied by the deck. */
  index: number;
  /** Total screen count, for the "01 / 07" counter. */
  total: number;
  children: ReactNode;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

export const DeckScreen = forwardRef<HTMLElement, DeckScreenProps>(
  function DeckScreen({ id, label, index, total, children, className }, ref) {
    const { activeIndex } = useDeck();

    // Animate the first time this screen becomes active, then keep it shown
    // (scrolling back doesn't re-trigger / flash empty). Screen 0 starts shown.
    const [seen, setSeen] = useState(index === 0);
    const isActive = activeIndex === index;
    const seenRef = useRef(seen);
    seenRef.current = seen;
    useEffect(() => {
      if (isActive && !seenRef.current) setSeen(true);
    }, [isActive]);

    const inView = isActive || seen;

    return (
      <section
        ref={ref}
        id={id}
        aria-roledescription="slide"
        aria-label={`${label} — slide ${index + 1} of ${total}`}
        className={cn(
          // Mobile: natural height — content determines section size (snap is
          // off below lg so no mandatory-snap trap). lg+: min-h-full so each
          // section fills the fixed-height snap container for one-per-viewport.
          "snap-screen relative flex flex-col justify-center",
          "py-6 lg:min-h-full",
          "px-3 sm:px-8 lg:px-12",
          className,
        )}
      >
        {/* Each slide's CONTENT AREA sits in its own hairline-framed panel — the
            boundary reads per-slide, not around the whole deck/navigator. */}
        <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-col rounded-2xl border border-line bg-surface/70 px-4 py-5 shadow-card sm:px-8 sm:py-7 lg:px-10 lg:py-9">
          {/* Slide counter + section eyebrow — top chrome of each slide. */}
          <div
            className={cn(
              "flex w-full items-center gap-3 pb-4 sm:pb-6",
              "transition-all duration-500 ease-out",
              inView ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0",
            )}
          >
            <span className="eyebrow text-accent-600/70">
              {pad(index + 1)}&nbsp;/&nbsp;{pad(total)}
            </span>
            {/* Hairline that "draws" in sapphire as the slide arrives. */}
            <span
              className="relative h-px flex-1 overflow-hidden bg-line"
              aria-hidden="true"
            >
              <span
                className={cn(
                  "absolute inset-y-0 left-0 bg-accent-500 transition-[width] duration-700 ease-out",
                  inView ? "w-full" : "w-0",
                )}
              />
            </span>
            <span className="eyebrow text-muted">{label}</span>
          </div>

          {/* Content column — children gate their own entrance via <Reveal>.
              min-w-0 prevents unbreakable content from blowing out the flex
              parent. overflow-x-auto (not hidden) lets any inner code/pre block
              that is wider than the panel scroll horizontally within this div
              rather than being silently clipped — page blowout is still
              contained because min-w-0 stops this div itself from growing. */}
          <ScreenInViewContext.Provider value={inView}>
            <div className="w-full min-w-0 overflow-x-auto">{children}</div>
          </ScreenInViewContext.Provider>
        </div>
      </section>
    );
  },
);
