/**
 * WhoOwnsSkills — Section 5 of the Learn page.
 *
 * Lightly covers the governance model: domain experts author; peer review
 * before sharing; honest governance gap. 3 bullets + a callout. Facts from §4.
 */
import { Badge, Callout } from "@/components/ui";
import {
  UserGroupIcon,
  CheckBadgeIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export function WhoOwnsSkills() {
  return (
    <section aria-labelledby="who-owns-heading" className="space-y-6">
      <div>
        <Badge tone="accent" className="mb-3">
          Ownership
        </Badge>
        <h2
          id="who-owns-heading"
          className="text-2xl font-semibold tracking-tight text-fg"
        >
          Who owns skills?
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
          The best skills come from people closest to the work — not central IT.
          Here’s the lightweight model that keeps things healthy.
        </p>
      </div>

      <ul className="space-y-4" role="list">
        {BULLETS.map(({ icon: Icon, title, body, iconClass }) => (
          <li
            key={title}
            className="flex gap-4 rounded-control border border-line bg-surface p-4"
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-control ${iconClass}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-fg">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>

      <Callout
        tone="warn"
        title="The portable-format bonus"
        icon={false}
        className="border-accent-200 bg-accent-50 text-accent-900"
      >
        The SKILL.md format — Markdown body + YAML frontmatter with{" "}
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
    </section>
  );
}

const BULLETS = [
  {
    icon: UserGroupIcon,
    title: "Domain experts author the skills closest to their work",
    body: "The analyst who writes the weekly report should author the weekly-report skill. They know the nuances. No admin registration needed — just drop the file in OneDrive.",
    iconClass: "bg-accent-100 text-accent-700",
  },
  {
    icon: CheckBadgeIcon,
    title: "A quick peer review before sharing",
    body: "Before you share a skill with your team, have a colleague run it on a few real drafts. Skills that skip this step tend to drift from what the team actually needs.",
    iconClass: "bg-ok-50 text-ok-600",
  },
  {
    icon: ShieldExclamationIcon,
    title: "Personal skills bypass central validation",
    body: "Microsoft does not validate custom skills stored in a user's personal OneDrive. Review outputs carefully — especially before acting on anything consequential.",
    iconClass: "bg-warn-50 text-warn-700",
  },
] as const;
