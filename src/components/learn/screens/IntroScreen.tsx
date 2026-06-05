"use client";

/**
 * IntroScreen — slide 1. The title card for the Learn presentation: sets the
 * promise ("learn just enough, then build one") and previews the run of slides.
 * Editorial register — serif headline, mono eyebrow, warm paper.
 */
import Link from "next/link";
import { buttonClasses } from "@/components/ui";
import { ArrowRightIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { Reveal } from "../Reveal";

const AGENDA = [
  "What Cowork actually is",
  "Why a skill beats a prompt",
  "Prompt vs Skill vs Agent",
  "Anatomy of a SKILL.md",
  "Who should own skills",
] as const;

export function IntroScreen() {
  return (
    <div className="space-y-8">
      <Reveal as="p" className="eyebrow text-accent-600">
        Module 1 · Learn
      </Reveal>

      <Reveal
        as="h1"
        delay={60}
        className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-7xl"
      >
        Learn just enough.
        <br />
        Then <span className="mark-amber">build one.</span>
      </Reveal>

      <Reveal
        as="p"
        delay={140}
        className="max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
      >
        A five-minute tour of Microsoft&nbsp;365 Copilot Cowork skills — what
        they are, why they beat one-off prompts, and what a{" "}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-base">
          SKILL.md
        </code>{" "}
        looks like. Then you&rsquo;ll author a real one and watch it run.
      </Reveal>

      <Reveal delay={220}>
        <ol className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted">
          {AGENDA.map((item, i) => (
            <li key={item} className="flex items-center gap-2">
              <span className="font-mono text-xs text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={300} className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/build" className={buttonClasses("primary", "lg")}>
          Skip to the lab
          <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <ArrowDownIcon className="h-4 w-4 animate-fade-in" aria-hidden="true" />
          or scroll to begin
        </span>
      </Reveal>
    </div>
  );
}
