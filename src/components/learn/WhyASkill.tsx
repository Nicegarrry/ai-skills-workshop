/**
 * WhyASkill — Section 2 of the Learn page.
 *
 * Motivates the "skill not a prompt" distinction: one-off prompts are typed
 * each time and forgotten; a skill is reusable and auto-discovered.
 */
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui";
import {
  BoltIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export function WhyASkill() {
  return (
    <section aria-labelledby="why-skill-heading" className="space-y-6">
      <div>
        <Badge tone="accent" className="mb-3">
          The core idea
        </Badge>
        <h2
          id="why-skill-heading"
          className="text-2xl font-semibold tracking-tight text-fg"
        >
          Why a <em>skill</em>, not just a prompt?
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
          A one-off prompt lives in your head — you retype it every time and
          Cowork forgets it the moment the conversation ends. A skill is{" "}
          <strong className="text-fg">
            a reusable capability you author once
          </strong>{" "}
          and store in OneDrive. Cowork auto-discovers it at the start of every
          conversation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {POINTS.map(({ icon: Icon, title, body, tone }) => (
          <Card key={title} padded>
            <CardHeader>
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-control ${tone}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <CardTitle className="mt-2">{title}</CardTitle>
            </CardHeader>
            <CardBody>{body}</CardBody>
          </Card>
        ))}
      </div>

      <p className="text-sm font-medium text-muted">
        Bottom line:{" "}
        <span className="text-fg">
          write the skill once, use it on every draft, forever.
        </span>
      </p>
    </section>
  );
}

const POINTS = [
  {
    icon: BoltIcon,
    title: "A prompt is a one-shot",
    body: "You type it, it runs, it's gone. Next time you start from scratch — and it sounds different every time.",
    tone: "bg-neutral-100 text-neutral-600",
  },
  {
    icon: ArrowPathIcon,
    title: "A skill is reusable",
    body: "Stored as a SKILL.md file in OneDrive. Same instructions, same voice, every run — consistent quality at zero marginal effort.",
    tone: "bg-accent-100 text-accent-700",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Auto-discovered by Cowork",
    body: "Cowork reads the skill's description and loads it automatically when the task matches — no slash command or menu needed.",
    tone: "bg-accent-100 text-accent-700",
  },
] as const;
