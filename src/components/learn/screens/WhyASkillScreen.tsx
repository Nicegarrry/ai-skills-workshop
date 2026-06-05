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
import { Sparkle } from "@/components/cowork";
import { cn } from "@/lib/cn";
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
    title: "Two ways to run it",
    body: "Cowork loads it automatically when a task matches its description — or call it on demand by typing / and picking it from the Skills menu.",
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

      <Reveal delay={460}>
        <div className="grid items-center gap-5 rounded-card border border-line bg-surface-2 p-5 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-base font-medium text-fg sm:text-lg">
              Call it on demand with a slash command.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              In Cowork, type <code className="font-mono text-[13px]">/</code>,
              open <span className="font-medium text-fg">Skills</span>, pick your
              skill, and add any extra context — then hit enter.
            </p>
          </div>
          <SlashMock />
        </div>
      </Reveal>
    </div>
  );
}

/** A faithful little mock of invoking a skill on demand in Cowork: type "/", the
 *  Skills menu appears, pick one. Illustrative (Register B / Fluent tokens). */
function SlashMock() {
  const skills = ["email-in-my-voice", "weekly-report", "meeting-notes"];
  return (
    <div className="w-full rounded-xl border border-cw-line bg-cw-surface p-2 font-fluent shadow-cw-pop sm:w-72">
      <div className="overflow-hidden rounded-lg border border-cw-line-soft">
        <p className="border-b border-cw-line-soft bg-cw-bg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-cw-muted">
          Skills
        </p>
        <ul className="py-1">
          {skills.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5",
                i === 0 && "bg-cw-brand-tint",
              )}
            >
              <Sparkle size={14} secondary={false} />
              <span
                className={cn(
                  "font-mono text-[12px]",
                  i === 0 ? "text-cw-text" : "text-cw-muted",
                )}
              >
                {s}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-cw-line px-3 py-2">
        <Sparkle size={16} secondary={false} />
        <span className="font-mono text-sm text-cw-text">
          /email
          <span className="ml-px inline-block h-4 w-px animate-pulse bg-cw-text align-middle" />
        </span>
      </div>
    </div>
  );
}
