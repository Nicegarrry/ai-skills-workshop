/**
 * Module 1 — Learn (/learn)
 *
 * Rebuilt as a FULL-VIEWPORT SCROLL-SNAP PRESENTATION DECK, designed for
 * screen-sharing / presenting to a room. Seven slides cover just enough theory
 * before the lab: overview → what Cowork is → why a skill → the four building
 * blocks → SKILL.md anatomy → who owns skills → "now build one."
 *
 * The page itself is a server component; the deck (scroll container,
 * IntersectionObserver, progress rail, keyboard nav) is the client <LearnDeck>.
 * Each slide fills the viewport below the slim sticky Nav and animates in as it
 * scrolls into view.
 *
 * All Microsoft 365 Copilot Cowork facts trace to BUILD_BRIEF §4; the shared
 * Footer carries the preview disclaimer + sources.
 */
import type { Metadata } from "next";
import { LearnDeck } from "@/components/learn";

export const metadata: Metadata = {
  title: "Learn — AI Skills Workshop",
  description:
    "A scroll-snap presentation: what Microsoft 365 Copilot Cowork is, why a skill beats a prompt, and what a SKILL.md looks like — then build one.",
};

export default function LearnPage() {
  return <LearnDeck />;
}
