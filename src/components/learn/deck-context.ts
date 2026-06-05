/**
 * deck-context — the wiring between the LearnDeck orchestrator and the
 * individual DeckScreen sections.
 *
 * The deck is a full-viewport scroll-snap presentation (see `.snap-deck` /
 * `.snap-screen` in globals.css). The orchestrator owns the scroll container,
 * the IntersectionObserver, keyboard navigation, and the fixed progress rail
 * (so those stay in one place); each DeckScreen consumes only the active-screen
 * index from this context, to animate its content in when it scrolls into view.
 *
 * Static, server-safe types live here so both the client orchestrator and the
 * (also client) screen wrapper share one source of truth.
 */
import { createContext, useContext } from "react";

/** One entry in the fixed progress rail — derived from the deck's screen list. */
export type DeckScreenMeta = {
  /** Stable id; also the section's DOM id + scroll anchor. */
  id: string;
  /** Short label shown in the progress-rail tooltip / aria-label. */
  label: string;
};

export type DeckContextValue = {
  /** Index of the screen currently filling the viewport. */
  activeIndex: number;
};

export const DeckContext = createContext<DeckContextValue | null>(null);

/** Read the deck context; throws if a DeckScreen is rendered outside a LearnDeck. */
export function useDeck(): DeckContextValue {
  const ctx = useContext(DeckContext);
  if (!ctx) {
    throw new Error("useDeck must be used within a <LearnDeck>.");
  }
  return ctx;
}
