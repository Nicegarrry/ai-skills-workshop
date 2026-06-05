/**
 * Module 1 — Learn (/learn)
 *
 * Scrollable, build-oriented content that gives learners just enough theory
 * before they head to /build. Five content sections + a sticky CTA.
 *
 * All Microsoft 365 Copilot Cowork facts sourced from BUILD_BRIEF §4.
 * Cowork is in preview (Frontier program); the footer carries the disclaimer.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  MeetCowork,
  WhyASkill,
  BuildingBlocks,
  SkillAnatomy,
  WhoOwnsSkills,
  LearnCTA,
} from "@/components/learn";

export const metadata: Metadata = {
  title: "Learn — AI Skills Workshop",
  description:
    "Understand what Microsoft 365 Copilot Cowork is, why a skill beats a prompt, and what a SKILL.md looks like — then build one.",
};

/**
 * Inline nav used only on the Learn page — shows which section you're on.
 * Rendered server-side; no JS needed for a scrollable page with anchor links.
 */
function LearnNav() {
  return (
    <nav
      aria-label="Page sections"
      className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted"
    >
      {SECTION_LINKS.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className="transition-colors hover:text-fg focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-accent-500"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

const SECTION_LINKS = [
  { href: "#meet-cowork-heading", label: "Meet Cowork" },
  { href: "#why-skill-heading", label: "Why a skill?" },
  { href: "#building-blocks-heading", label: "Building blocks" },
  { href: "#anatomy-heading", label: "SKILL.md anatomy" },
  { href: "#who-owns-heading", label: "Who owns skills?" },
];

export default function LearnPage() {
  return (
    <>
      {/* Main content — padded to clear the sticky CTA bar on large screens */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-10 sm:px-6 lg:pb-24">
        {/* Page header */}
        <header className="mb-10 space-y-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link
                  href="/"
                  className="hover:text-fg transition-colors"
                >
                  Workshop
                </Link>
              </li>
              <li aria-hidden="true" className="select-none">
                /
              </li>
              <li aria-current="page" className="text-fg">
                Learn
              </li>
            </ol>
          </nav>

          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-accent-600">
              Module 1
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Learn just enough
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              What Cowork is, why skills beat one-off prompts, how a SKILL.md is
              structured, and who should own them. About 5 minutes — then you
              build.
            </p>
          </div>

          <LearnNav />
        </header>

        {/* Divider between sections */}
        <div className="space-y-14">
          <MeetCowork />
          <hr className="border-line" />
          <WhyASkill />
          <hr className="border-line" />
          <BuildingBlocks />
          <hr className="border-line" />
          <SkillAnatomy />
          <hr className="border-line" />
          <WhoOwnsSkills />
          <hr className="border-line" />
          {/* Inline CTA — visible on mobile (sticky bar hidden on small screens) */}
          <LearnCTA sticky={false} />
        </div>
      </main>

      {/* Sticky bottom CTA — only visible lg+ (hidden below via LearnCTA sticky prop) */}
      <LearnCTA sticky />
    </>
  );
}
