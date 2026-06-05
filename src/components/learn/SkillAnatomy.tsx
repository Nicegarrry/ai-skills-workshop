/**
 * SkillAnatomy — Section 4 of the Learn page.
 *
 * Annotated SKILL.md + voice.md example via CodePane, with call-outs for the
 * OneDrive path, limits, auto-discovery, and multi-file pattern. Facts from §4.
 */
import { Badge, Callout, CodePane } from "@/components/ui";
import {
  FolderIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const SKILL_MD_EXAMPLE = `---
name: email-in-my-voice
description: >
  Use when the user wants to turn a rough draft,
  notes, or bullet points into a finished email
  written in their own voice.
---

# Email in my voice

You rewrite the user's rough draft into a finished,
ready-to-send email that sounds like them.

Steps:
1. Read voice.md to learn the user's tone and habits.
2. Rewrite the draft to carry that voice — match warmth,
   sentence length, and formality.
3. Add a fitting subject line, greeting, and sign-off.
4. Fix grammar and spelling. Never invent facts.

Output only the finished email — no commentary.

<!-- Supporting file referenced by this skill: -->
<!-- /Documents/Cowork/skills/email-in-my-voice/voice.md -->`;

const VOICE_MD_EXAMPLE = `# My voice

## Sample emails
Hi Sam,

Quick one — I've pushed the deck to the shared drive.
Two slides still need the Q3 numbers, I'll have those
by Thursday. Shout if you want to walk through it first.

Cheers, Alex

## Tone notes
Warm but efficient. Conversational, no corporate jargon.
Gets to the point fast. Short paragraphs. Signs off
with "Cheers" or first name only.`;

export function SkillAnatomy() {
  return (
    <section aria-labelledby="anatomy-heading" className="space-y-6">
      <div>
        <Badge tone="accent" className="mb-3">
          Anatomy
        </Badge>
        <h2
          id="anatomy-heading"
          className="text-2xl font-semibold tracking-tight text-fg"
        >
          What’s inside a SKILL.md?
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
          Two parts: a short YAML frontmatter block at the top, then a plain
          Markdown body with your instructions. That’s the whole format.
        </p>
      </div>

      {/* Two-column panes on wider screens */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-fg">SKILL.md</p>
          <CodePane
            filename="SKILL.md"
            code={SKILL_MD_EXAMPLE}
            language="markdown"
            maxHeight="22rem"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-fg">
            voice.md{" "}
            <span className="ml-1 font-normal text-muted">
              (supporting file)
            </span>
          </p>
          <CodePane
            filename="voice.md"
            code={VOICE_MD_EXAMPLE}
            language="markdown"
            maxHeight="22rem"
          />
        </div>
      </div>

      {/* Call-out annotations */}
      <div className="grid gap-3 sm:grid-cols-2">
        {CALLOUTS.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="flex gap-3 rounded-control border border-line bg-surface p-4"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-accent-50">
              <Icon className="h-4 w-4 text-accent-600" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-fg">{title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Governance callout */}
      <Callout tone="warn" title="Governance note" icon>
        Custom skills created by users aren’t validated by Microsoft. Review
        custom skill outputs carefully. Personal OneDrive skills bypass central
        IT review — share cautiously.
      </Callout>
    </section>
  );
}

const CALLOUTS = [
  {
    icon: FolderIcon,
    title: "OneDrive install path",
    body: "Drop the file at /Documents/Cowork/skills/<skill-name>/SKILL.md — that's all the installation that's needed. No admin registration required.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Discovery = the description",
    body: 'Cowork reads the description field at the start of each conversation. Start it with "Use when…" and name the task — that\'s what determines whether Cowork loads your skill.',
  },
  {
    icon: DocumentTextIcon,
    title: "Multi-file skills",
    body: "A skill folder can hold supporting files — like voice.md — that SKILL.md references. This keeps the main file clean and lets you swap out pieces independently.",
  },
  {
    icon: ExclamationTriangleIcon,
    title: "Limits",
    body: "Up to 50 custom skills per user; each skill file up to 1 MB. The whole folder (SKILL.md + supporting files) lives under that one OneDrive path.",
  },
] as const;
