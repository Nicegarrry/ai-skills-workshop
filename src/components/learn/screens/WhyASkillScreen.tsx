"use client";

/**
 * WhyASkillScreen — slide 3. The motivating idea of the whole workshop: a
 * one-off prompt is typed and forgotten; a skill is a reusable, auto-discovered
 * capability you author once. Facts from BUILD_BRIEF §4 only.
 */
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui";
import {
  BoltIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Reveal } from "../Reveal";

const POINTS = [
  {
    icon: BoltIcon,
    title: "A prompt is a one-shot",
    body: "You type it, it runs, it's gone. Next time you start from scratch — and it sounds a little different every time.",
    iconClass: "bg-neutral-100 text-neutral-600",
  },
  {
    icon: ArrowPathIcon,
    title: "A skill is reusable",
    body: "Stored as a SKILL.md in OneDrive. Same instructions, same voice, every run — consistent quality at zero marginal effort.",
    iconClass: "bg-accent-100 text-accent-700",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Auto-discovered",
    body: "Cowork reads the skill's description and loads it automatically when the task matches — no slash command, no menu.",
    iconClass: "bg-accent-100 text-accent-700",
  },
] as const;

export function WhyASkillScreen() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Reveal as="p" className="eyebrow">
          The core idea
        </Reveal>
        <Reveal
          as="h2"
          delay={60}
          className="font-serif text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl"
        >
          Why a <span className="italic">skill</span>, not just a{" "}
          <span className="mark-amber">prompt?</span>
        </Reveal>
        <Reveal
          as="p"
          delay={120}
          className="max-w-2xl text-lg leading-relaxed text-muted"
        >
          A one-off prompt lives in your head — you retype it every time and
          Cowork forgets it the moment the conversation ends. A skill is a
          reusable capability you author once and store in OneDrive, and Cowork
          auto-discovers it at the start of every conversation.
        </Reveal>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {POINTS.map(({ icon: Icon, title, body, iconClass }, i) => (
          <Reveal key={title} delay={200 + i * 80} variant="rise">
            <Card padded className="card-lift h-full">
              <CardHeader>
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-control ${iconClass}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <CardTitle className="mt-2">{title}</CardTitle>
              </CardHeader>
              <CardBody>{body}</CardBody>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal
        delay={460}
        as="p"
        className="text-base font-medium text-muted sm:text-lg"
      >
        Bottom line:{" "}
        <span className="text-fg">
          write the skill once, use it on every draft, forever.
        </span>
      </Reveal>
    </div>
  );
}
