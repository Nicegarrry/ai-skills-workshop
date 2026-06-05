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
          "snap-screen relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center",
          "px-5 py-16 sm:px-8 lg:px-12",
          className,
        )}
      >
        {/* Slide counter + section eyebrow — top chrome of each slide. */}
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 pb-8">
          <span className="eyebrow text-accent-600/70">
            {pad(index + 1)}&nbsp;/&nbsp;{pad(total)}
          </span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <span className="eyebrow text-muted">{label}</span>
        </div>

        {/* Content column — children gate their own entrance via <Reveal>. */}
        <ScreenInViewContext.Provider value={inView}>
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </ScreenInViewContext.Provider>
      </section>
    );
  },
);
