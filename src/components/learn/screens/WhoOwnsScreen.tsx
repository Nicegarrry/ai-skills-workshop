"use client";

/**
 * WhoOwnsScreen — slide 6. The lightweight ownership model: domain experts
 * author; a quick peer review; the honest governance gap. Plus the portable-
 * format bonus (open convention across Cowork, GitHub Copilot, Claude). Facts §4.
 */
import { Callout } from "@/components/ui";
import {
  UserGroupIcon,
  CheckBadgeIcon,
  ShieldExclamationIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { Reveal } from "../Reveal";

const BULLETS = [
  {
    icon: UserGroupIcon,
    title: "Domain experts author them",
    body: "The analyst who writes the weekly report should author the weekly-report skill — they know the nuances. No admin registration needed.",
    iconClass: "bg-accent-100 text-accent-700",
  },
  {
    icon: CheckBadgeIcon,
    title: "A quick peer review",
    body: "Before sharing a skill with your team, have a colleague run it on a few real drafts. Skills that skip this drift from what the team needs.",
    iconClass: "bg-ok-50 text-ok-600",
  },
  {
    icon: ShieldExclamationIcon,
    title: "Personal skills bypass validation",
    body: "Microsoft does not validate custom skills in a user's personal OneDrive. Review outputs carefully — especially before acting on anything consequential.",
    iconClass: "bg-warn-50 text-warn-700",
  },
] as const;

export function WhoOwnsScreen() {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <Reveal as="p" className="eyebrow">
          Ownership
        </Reveal>
        <Reveal
          as="h2"
          delay={60}
          className="font-serif text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl"
        >
          Who <span className="mark">owns</span> skills?
        </Reveal>
        <Reveal
          as="p"
          delay={120}
          className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          The best skills come from the people closest to the work — not central
          IT. Here is the lightweight model that keeps things healthy.
        </Reveal>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3" role="list">
        {BULLETS.map(({ icon: Icon, title, body, iconClass }, i) => (
          <Reveal key={title} delay={180 + i * 80} variant="rise" as="li">
            <div className="flex h-full flex-col gap-3 rounded-card border border-line bg-surface p-5 shadow-card">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-control ${iconClass}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-semibold text-fg">{title}</p>
              <p className="text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={400}>
        <div className="flex items-start gap-3 rounded-control border border-line bg-surface-2 px-5 py-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-accent-100 text-accent-700">
            <BuildingOffice2Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-fg sm:text-base">
            <span className="font-semibold">Skills vs agents — who owns them.</span>{" "}
            A skill is usually <em>one person&rsquo;s</em> — the expert closest to
            that task. Agents tend to run team- or enterprise-wide, with central
            governance and approval behind them.
          </p>
        </div>
      </Reveal>

      <Reveal delay={500}>
        <Callout
          tone="warn"
          title="The portable-format bonus"
          icon={false}
          className="border-accent-200 bg-accent-50 text-accent-900"
        >
          The SKILL.md format — a Markdown body plus YAML frontmatter with{" "}
          <code className="rounded bg-accent-100 px-1 py-0.5 font-mono text-xs">
            name
          </code>{" "}
          and{" "}
          <code className="rounded bg-accent-100 px-1 py-0.5 font-mono text-xs">
            description
          </code>{" "}
          — is an emerging open convention shared across Microsoft Cowork, GitHub
          Copilot, and Anthropic Claude. Skills you craft here transfer across
          tools.
        </Callout>
      </Reveal>
    </div>
  );
}
