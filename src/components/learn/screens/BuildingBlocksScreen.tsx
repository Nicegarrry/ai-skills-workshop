"use client";

/**
 * BuildingBlocksScreen — slide 4: "Prompt vs Skill vs Agent".
 *
 * The conceptual core of the module: three escalating levels of autonomy — a
 * one-shot Prompt you drive every time, a reusable Skill (a SKILL.md) Cowork
 * auto-loads and applies, and an Agent that runs a whole multi-step job on its
 * own (including scheduled/recurring tasks). Plugins give any of them reach.
 * Facts from BUILD_BRIEF §4 only.
 */
import { Card, CardBody, Badge } from "@/components/ui";
import {
  BookmarkIcon,
  AcademicCapIcon,
  BoltIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";
import { Reveal } from "../Reveal";

const LEVELS = [
  {
    icon: BookmarkIcon,
    label: "Prompt",
    tag: "you drive",
    headline: "You type it, every time.",
    body: "A one-shot instruction you write into the box. Powerful, but nothing is remembered — you re-explain what you want on every run.",
    autonomy: "Low autonomy",
    fill: 1,
    accent: false,
  },
  {
    icon: AcademicCapIcon,
    label: "Skill",
    tag: "Cowork loads it",
    headline: "Author once. Cowork applies it.",
    body: "Reusable know-how in a SKILL.md. Cowork auto-discovers it by its description and applies it whenever a task matches — no re-explaining. This is what you build today.",
    autonomy: "Medium autonomy",
    fill: 2,
    accent: true,
  },
  {
    icon: BoltIcon,
    label: "Agent",
    tag: "it runs the job",
    headline: "Delegate the whole outcome.",
    body: "Give Cowork a goal and it runs the multi-step job on its own — and can fire on a recurring schedule (a daily briefing, a weekly summary) with no hands on the wheel.",
    autonomy: "High autonomy",
    fill: 3,
    accent: false,
  },
] as const;

export function BuildingBlocksScreen() {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <Reveal as="p" className="eyebrow">
          The spectrum
        </Reveal>
        <Reveal
          as="h2"
          delay={60}
          className="font-serif text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl"
        >
          Prompt <span className="text-muted">→</span> <span className="mark">Skill</span>{" "}
          <span className="text-muted">→</span> Agent
        </Reveal>
        <Reveal
          as="p"
          delay={120}
          className="max-w-2xl text-lg leading-relaxed text-muted"
        >
          The same job, handed off with more and more autonomy. Knowing which
          level you need is the whole game — and a skill is the sweet spot you
          can build yourself.
        </Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {LEVELS.map(
          ({ icon: Icon, label, tag, headline, body, autonomy, fill, accent }, i) => (
            <Reveal key={label} delay={180 + i * 90} variant="rise">
              <Card
                padded
                className={cn(
                  "card-lift flex h-full flex-col gap-3",
                  accent && "ring-2 ring-accent-500/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-control",
                      accent
                        ? "bg-accent-600 text-white"
                        : "bg-neutral-100 text-neutral-600",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Badge tone={accent ? "accent" : "neutral"} className="font-normal">
                    {tag}
                  </Badge>
                </div>
                <div>
                  <p className="font-serif text-xl font-semibold text-fg">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-fg/80">{headline}</p>
                </div>
                <CardBody className="flex-1">{body}</CardBody>
                {/* Autonomy ramp */}
                <div className="mt-auto space-y-1.5 pt-1">
                  <div className="flex gap-1" aria-hidden="true">
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className={cn(
                          "h-1.5 flex-1 rounded-pill",
                          n <= fill
                            ? accent
                              ? "bg-accent-600"
                              : "bg-neutral-400"
                            : "bg-line",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted">{autonomy}</p>
                </div>
              </Card>
            </Reveal>
          ),
        )}
      </div>

      <Reveal
        delay={520}
        as="div"
        className="flex flex-col gap-2 rounded-control border border-line bg-surface-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4"
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-amber-100 text-amber-600">
          <PuzzlePieceIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-base text-fg">
          <span className="font-semibold">And plugins give them reach.</span> A
          prompt, skill, or agent does the thinking; a Microsoft 365 plugin lets
          Cowork touch an outside system — a CRM, a tracker, a data source. You
          combine them.
        </p>
      </Reveal>
    </div>
  );
}
