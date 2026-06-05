/**
 * MeetCowork — Section 1 of the Learn page.
 *
 * Introduces Microsoft 365 Copilot Cowork and shows a compact comparison
 * table (Chat vs Cowork). All facts from BUILD_BRIEF §4 only.
 */
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui";

export function MeetCowork() {
  return (
    <section aria-labelledby="meet-cowork-heading" className="space-y-6">
      <div>
        <Badge tone="accent" className="mb-3">
          What is Cowork?
        </Badge>
        <h2
          id="meet-cowork-heading"
          className="text-2xl font-semibold tracking-tight text-fg"
        >
          Meet Microsoft 365 Copilot Cowork
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
          Cowork is an <strong className="text-fg">agentic AI coworker</strong>{" "}
          inside Microsoft 365. It handles multi-step, long-running tasks —
          running asynchronously in the cloud even after you close your laptop.
          That’s a meaningful step beyond standard Copilot Chat.
        </p>
      </div>

      {/* Comparison table */}
      <Card padded={false} className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2">
              <th
                scope="col"
                className="py-3 pl-5 pr-4 text-left font-semibold text-fg"
              >
                Dimension
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left font-semibold text-fg"
              >
                Copilot Chat
              </th>
              <th
                scope="col"
                className="py-3 pl-4 pr-5 text-left font-semibold text-accent-700"
              >
                Cowork
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ROWS.map(({ dimension, chat, cowork }) => (
              <tr key={dimension} className="align-top">
                <td className="py-3 pl-5 pr-4 font-medium text-fg">
                  {dimension}
                </td>
                <td className="py-3 px-4 text-muted">{chat}</td>
                <td className="py-3 pl-4 pr-5 text-fg">{cowork}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Grounding note */}
      <Card padded className="border-accent-100 bg-accent-50/60">
        <CardHeader>
          <CardTitle className="text-accent-800">How Cowork knows things</CardTitle>
        </CardHeader>
        <CardBody className="text-accent-900">
          Cowork is grounded in <strong>Work IQ</strong> and your own
          OneDrive/SharePoint files — it inherits your existing permissions.
          It cannot access local files on your device. Under the hood, it uses{" "}
          <strong>Anthropic models</strong> as a subprocessor.
        </CardBody>
      </Card>
    </section>
  );
}

const ROWS = [
  {
    dimension: "How it works",
    chat: "Synchronous — you ask, it answers.",
    cowork: "Asynchronous, agentic — you assign, it works.",
  },
  {
    dimension: "Task length",
    chat: "Seconds to minutes.",
    cowork: "Minutes to hours, multi-step.",
  },
  {
    dimension: "Runs when closed?",
    chat: "No — stops when you close the window.",
    cowork: "Yes — continues in the cloud after you close your laptop.",
  },
  {
    dimension: "Customisable?",
    chat: "Prompts only.",
    cowork: "Custom Skills (SKILL.md) + Plugins + Scheduled tasks.",
  },
] as const;
