"use client";

/**
 * BuildCTAScreen — slide 7. The close: a recap of what they now know and a
 * single strong CTA into the lab (/build). Editorial register, centered.
 */
import Link from "next/link";
import { buttonClasses } from "@/components/ui";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Reveal } from "../Reveal";

const RECAP = [
  "Cowork is an agentic coworker that runs long tasks in the cloud",
  "A skill beats a prompt: reusable, auto-discovered, consistent",
  "A SKILL.md is just frontmatter + Markdown — and can bundle files",
  "Domain experts own skills; review outputs before you rely on them",
] as const;

export function BuildCTAScreen() {
  return (
    <div className="space-y-8 text-center">
      <Reveal as="p" className="eyebrow text-accent-600">
        You&rsquo;re ready
      </Reveal>

      <Reveal
        as="h2"
        delay={60}
        className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl"
      >
        Now <span className="mark-amber">build one.</span>
      </Reveal>

      <Reveal
        as="p"
        delay={120}
        className="mx-auto max-w-xl text-lg leading-relaxed text-muted"
      >
        You know what a skill is and why it matters. The lab takes about ten
        minutes — you&rsquo;ll author a real{" "}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-base">
          SKILL.md
        </code>{" "}
        plus a <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-base">voice.md</code>, test it live, and download both.
      </Reveal>

      <Reveal delay={200}>
        <ul
          role="list"
          className="mx-auto grid max-w-2xl gap-2.5 text-left sm:grid-cols-2"
        >
          {RECAP.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-control border border-line bg-surface px-4 py-3 text-sm text-fg shadow-card"
            >
              <CheckIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-ok-600"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={300} className="flex flex-col items-center gap-3 pt-2">
        <Link href="/build" className={buttonClasses("primary", "lg")}>
          Build the skill
          <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <a
          href="#intro"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-accent-500"
        >
          <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
          Back to the top
        </a>
      </Reveal>
    </div>
  );
}
