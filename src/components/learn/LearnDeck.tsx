"use client";

/**
 * LearnDeck — Module 1 "Learn" as a full-viewport scroll-snap PRESENTATION.
 *
 * Built for screen-sharing / presenting: a `.snap-deck` scroll container whose
 * height clears the slim sticky top Nav, wrapping N `.snap-screen` sections that
 * each lock to the viewport. Adds:
 *   - a fixed vertical progress rail (clickable dots) on the right,
 *   - full keyboard navigation (Arrow/Page/Home/End/Space),
 *   - in-view content animation (IntersectionObserver gates each screen's
 *     animate-fade-up / animate-rise so motion fires as you arrive).
 *
 * The deck owns scroll/active state; each DeckScreen consumes DeckContext to
 * know whether it's the active screen. This is a client component — the rest of
 * /learn (page.tsx) can stay a server component that just renders this.
 *
 * All Microsoft 365 Copilot Cowork facts trace to BUILD_BRIEF §4.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { DeckContext, type DeckContextValue, type DeckScreenMeta } from "./deck-context";
import { DeckScreen } from "./DeckScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { MeetCoworkScreen } from "./screens/MeetCoworkScreen";
import { WhyASkillScreen } from "./screens/WhyASkillScreen";
import { BuildingBlocksScreen } from "./screens/BuildingBlocksScreen";
import { SkillAnatomyScreen } from "./screens/SkillAnatomyScreen";
import { WhoOwnsScreen } from "./screens/WhoOwnsScreen";
import { BuildCTAScreen } from "./screens/BuildCTAScreen";

/**
 * Single source of truth for the deck: order, ids (also DOM ids + anchors),
 * progress-rail labels, and which content component renders each screen.
 */
const SCREENS: ReadonlyArray<DeckScreenMeta & { render: ReactNode }> = [
  { id: "intro", label: "Overview", render: <IntroScreen /> },
  { id: "meet-cowork", label: "Meet Cowork", render: <MeetCoworkScreen /> },
  { id: "why-skill", label: "Why a skill", render: <WhyASkillScreen /> },
  { id: "building-blocks", label: "Prompt · Skill · Agent", render: <BuildingBlocksScreen /> },
  { id: "anatomy", label: "SKILL.md anatomy", render: <SkillAnatomyScreen /> },
  { id: "ownership", label: "Who owns skills", render: <WhoOwnsScreen /> },
  { id: "build", label: "Now build one", render: <BuildCTAScreen /> },
];

export function LearnDeck() {
  const deckRef = useRef<HTMLDivElement>(null);
  /** DOM refs for each screen section, in source order — set during render. */
  const screenRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  /** Scroll a screen index into view by scrolling the DECK itself (not the
   *  window). No `behavior` arg → honours the deck's CSS scroll-behavior, which
   *  the global reduced-motion rule flips to `auto`. */
  const goTo = useCallback((index: number) => {
    const root = deckRef.current;
    if (!root) return;
    const clamped = Math.max(0, Math.min(SCREENS.length - 1, index));
    root.scrollTo({ top: clamped * root.clientHeight });
  }, []);

  // Track the active screen with a VIEWPORT-rooted IntersectionObserver (root:
  // null). As the deck scrolls, each screen moves through the viewport; the
  // most-visible one wins. Viewport-rooted is more reliable than rooting on the
  // snap container, and fires on any position change (wheel, keyboard, touch).
  // rootMargin trims the slim sticky Nav (h-14 = 56px) off the top.
  useEffect(() => {
    const sections = screenRefs.current.filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }
        let best = 0;
        let bestRatio = -1;
        sections.forEach((el, i) => {
          const r = ratios.get(el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        setActiveIndex(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-56px 0px 0px 0px" },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation — only when focus is inside the deck (so it doesn't
  // hijack the nav or other page chrome). PageDown/Down/Space → next, etc.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Don't steal typing from any focused control inside a screen.
      const target = e.target as HTMLElement;
      if (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        return;
      }
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          goTo(activeIndex + 1);
          break;
        case " ":
          // Space pages forward (Shift+Space back) — classic deck control.
          e.preventDefault();
          goTo(activeIndex + (e.shiftKey ? -1 : 1));
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goTo(activeIndex - 1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(SCREENS.length - 1);
          break;
        default:
          break;
      }
    },
    [activeIndex, goTo],
  );

  const ctx = useMemo<DeckContextValue>(
    () => ({ activeIndex }),
    [activeIndex],
  );

  return (
    <DeckContext.Provider value={ctx}>
      <div className="relative flex-1">
        <div
          ref={deckRef}
          // Each screen fills the area below the sticky h-14 (3.5rem) Nav.
          className="snap-deck h-[calc(100svh-3.5rem)] outline-none"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          aria-roledescription="carousel"
          aria-label="Learn module presentation"
        >
          {SCREENS.map(({ id, label, render }, i) => (
            <DeckScreen
              key={id}
              id={id}
              label={label}
              index={i}
              total={SCREENS.length}
              ref={(el) => {
                screenRefs.current[i] = el;
              }}
            >
              {render}
            </DeckScreen>
          ))}
        </div>

        <ProgressRail
          screens={SCREENS}
          activeIndex={activeIndex}
          onSelect={goTo}
        />
      </div>
    </DeckContext.Provider>
  );
}

/**
 * Fixed vertical slide-progress indicator — one clickable dot per screen. The
 * active dot stretches into a pill. Hidden on small screens (a slide counter
 * inside each screen still shows position there). Decorative dots are buttons
 * with accessible labels so the rail is keyboard- and screen-reader-usable.
 */
function ProgressRail({
  screens,
  activeIndex,
  onSelect,
}: {
  screens: ReadonlyArray<DeckScreenMeta>;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Slide navigation"
      className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ol className="pointer-events-auto flex list-none flex-col items-center gap-3 p-0">
        {screens.map((s, i) => {
          const isActive = i === activeIndex;
          return (
            <li key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Go to slide ${i + 1}: ${s.label}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group relative flex items-center justify-center rounded-pill",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
                )}
              >
                <span
                  className={cn(
                    "block rounded-pill transition-all duration-300 ease-out",
                    isActive
                      ? "h-6 w-1.5 bg-accent-600"
                      : "h-1.5 w-1.5 bg-neutral-400 group-hover:bg-accent-400",
                  )}
                />
                {/* Hover label */}
                <span
                  className={cn(
                    "pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-control",
                    "border border-line bg-surface px-2 py-1 text-xs font-medium text-fg shadow-card",
                    "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
