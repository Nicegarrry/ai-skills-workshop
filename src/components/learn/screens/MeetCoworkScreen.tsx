"use client";

/**
 * MeetCoworkScreen — slide 2. Introduces Cowork as an agentic coworker and
 * contrasts it with Copilot Chat in a compact table, plus the grounding note.
 * All facts from BUILD_BRIEF §4 only.
 */
import { Card } from "@/components/ui";
import { BoltIcon } from "@heroicons/react/24/outline";
import { Reveal } from "../Reveal";

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
    cowork: "Yes — keeps working in the cloud after you close your laptop.",
  },
  {
    dimension: "Takes actions?",
    chat: "No — it drafts; you send and edit yourself.",
    cowork: "Yes — sends emails, posts in Teams, edits files, manages your calendar.",
  },
  {
    dimension: "Customisable?",
    chat: "Prompts only.",
    cowork: "Custom Skills (SKILL.md) + plugins + scheduled tasks.",
  },
] as const;

export function MeetCoworkScreen() {
  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <Reveal as="p" className="eyebrow">
          What is Cowork?
        </Reveal>
        <Reveal
          as="h2"
          delay={60}
          className="font-serif text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl"
        >
          An <span className="mark">agentic coworker</span>, not a chatbot.
        </Reveal>
        <Reveal
          as="p"
          delay={120}
          className="max-w-2xl text-lg leading-relaxed text-muted"
        >
          Cowork is an agentic AI coworker inside Microsoft&nbsp;365. It handles
          multi-step, long-running tasks — running asynchronously in the cloud
          even after you close your laptop. That is a real step beyond standard
          Copilot Chat.
        </Reveal>
      </div>

      <Reveal delay={200}>
        <Card padded={false} className="overflow-hidden">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="border-b border-line bg-surface-2">
                <th scope="col" className="py-3 pl-5 pr-4 font-semibold text-fg">
                  Dimension
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-muted">
                  Copilot Chat
                </th>
                <th
                  scope="col"
                  className="py-3 pl-4 pr-5 font-semibold text-accent-700"
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
                  <td className="px-4 py-3 text-muted">{chat}</td>
                  <td className="py-3 pl-4 pr-5 text-fg">{cowork}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Reveal>

      <Reveal delay={260}>
        <div className="flex items-start gap-3 rounded-card border border-accent-300 bg-accent-50 px-5 py-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-accent-600 text-white">
            <BoltIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-accent-900 sm:text-base">
            <span className="font-semibold">
              The big leap: Cowork doesn&rsquo;t just draft — it acts.
            </span>{" "}
            As part of finishing a task it can edit files, send emails, and post
            Teams messages on your behalf (asking you to approve sensitive steps).
            Chat can only suggest; Cowork does the doing.
          </p>
        </div>
      </Reveal>

      <Reveal
        delay={340}
        className="rounded-card border border-accent-200 bg-accent-50 px-5 py-4 text-sm leading-relaxed text-accent-900 sm:text-base"
      >
        <span className="font-semibold">How it knows things: </span>
        Cowork is grounded in <strong>Work&nbsp;IQ</strong> and your own
        OneDrive/SharePoint files — it inherits your existing permissions and
        cannot access local files. Under the hood it uses{" "}
        <strong>Anthropic models</strong> as a subprocessor.
      </Reveal>
    </div>
  );
}
