/**
 * BuildingBlocks — Section 3 of the Learn page.
 *
 * Four building blocks mapped to Cowork's own terms, each as a card with a
 * "reach for this when" trigger line. Facts from BUILD_BRIEF §4 only.
 */
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui";
import {
  AcademicCapIcon,
  BookmarkIcon,
  PuzzlePieceIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export function BuildingBlocks() {
  return (
    <section aria-labelledby="building-blocks-heading" className="space-y-6">
      <div>
        <Badge tone="accent" className="mb-3">
          Mental model
        </Badge>
        <h2
          id="building-blocks-heading"
          className="text-2xl font-semibold tracking-tight text-fg"
        >
          The four building blocks
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
          Cowork surfaces four distinct capabilities. Knowing which to reach for
          keeps you from over-engineering (or under-equipping) your workflow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {BLOCKS.map(({ icon: Icon, label, nickname, coworkTerm, when, accent }) => (
          <Card key={label} padded>
            <CardHeader>
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control ${accent.icon}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {label}
                    <Badge tone={accent.badge as "accent" | "neutral"} className="font-normal">
                      {nickname}
                    </Badge>
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-muted">{coworkTerm}</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>{when}</CardBody>
          </Card>
        ))}
      </div>

      <p className="rounded-control border border-line bg-surface-2 px-4 py-3 text-sm text-fg">
        <span className="font-semibold">One-liner: </span>
        skills teach Cowork <em>how</em>; plugins give it <em>reach</em>; you
        usually combine them.
      </p>
    </section>
  );
}

const BLOCKS = [
  {
    icon: AcademicCapIcon,
    label: "Custom Skill",
    nickname: "the brain",
    coworkTerm: "SKILL.md in OneDrive",
    when: 'Reach for this when you want Cowork to know how to do something your way — consistently, every time. "Use when you want to rewrite emails in my voice."',
    accent: { icon: "bg-accent-100 text-accent-700", badge: "accent" },
  },
  {
    icon: BookmarkIcon,
    label: "Saved Prompt",
    nickname: "a shortcut",
    coworkTerm: "Prompt you trigger yourself",
    when: "Reach for this when you have a fixed instruction you want to re-run quickly — but you always kick it off manually. No auto-discovery.",
    accent: { icon: "bg-neutral-100 text-neutral-600", badge: "neutral" },
  },
  {
    icon: PuzzlePieceIcon,
    label: "Plugin / Connector",
    nickname: "the hands",
    coworkTerm: "Microsoft 365 App Store plugin",
    when: "Reach for this when Cowork needs to reach an external system — a CRM, a project tracker, a data source. Installed from the Microsoft 365 App Store.",
    accent: { icon: "bg-neutral-100 text-neutral-600", badge: "neutral" },
  },
  {
    icon: ClockIcon,
    label: "Scheduled Task",
    nickname: "set & forget",
    coworkTerm: "Agentic recurring job",
    when: "Reach for this when a task should fire on a recurring trigger — daily briefing, weekly summary, monthly report — without you lifting a finger.",
    accent: { icon: "bg-neutral-100 text-neutral-600", badge: "neutral" },
  },
] as const;
