"use client";

/**
 * SkillAnatomyScreen — slide 5. Shows a skill as it actually lives on disk: an
 * INTERACTIVE folder tree (a file-explorer view) on the left — click a file and
 * its preview swaps in on the right — with tight call-outs for the OneDrive
 * path, discovery-by-description, the multi-file pattern, and limits. Segues to
 * the lab. Facts from BUILD_BRIEF §4.
 */
import { useState } from "react";
import { CodePane } from "@/components/ui";
import {
  FolderIcon,
  FolderOpenIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";
import { Reveal } from "../Reveal";

type FileId = "skill" | "voice";

const SKILL_MD_EXAMPLE = `---
name: email-in-my-voice
description: >
  Use when the user wants to turn a rough draft
  or notes into a finished email in their voice.
---

# Email in my voice

Rewrite the user's rough draft into a finished,
ready-to-send email that sounds like them.

1. Read voice.md for the user's tone and habits.
2. Rewrite the draft to carry that voice.
3. Add a subject line, greeting, and sign-off.

Output only the finished email — no commentary.`;

const VOICE_MD_EXAMPLE = `# My voice

## Sample email
Hi Sam — quick one. Pushed the deck to the
shared drive. Two slides still need Q3 numbers;
I'll have those Thursday. Shout if you want to
walk through it first. Cheers, Alex

## Tone notes
Warm but efficient. No corporate jargon. Short
paragraphs. Signs off "Cheers" or first name.`;

const FILES: Record<
  FileId,
  { filename: string; code: string; note: string; accent: boolean }
> = {
  skill: {
    filename: "SKILL.md",
    code: SKILL_MD_EXAMPLE,
    note: "the instructions",
    accent: true,
  },
  voice: {
    filename: "voice.md",
    code: VOICE_MD_EXAMPLE,
    note: "supporting file",
    accent: false,
  },
};

const CALLOUTS = [
  {
    icon: FolderIcon,
    title: "OneDrive path",
    body: "Lives at /Documents/Cowork/skills/<name>/. No admin registration needed.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Discovery = the description",
    body: 'Start it "Use when…" and name the task — that\'s what makes Cowork load it.',
  },
  {
    icon: DocumentTextIcon,
    title: "Multi-file skills",
    body: "The folder can hold supporting files — like voice.md — that SKILL.md references.",
  },
  {
    icon: ExclamationTriangleIcon,
    title: "Limits",
    body: "Up to 50 skills per user; each skill file up to 1 MB.",
  },
] as const;

/** Interactive file-explorer: click a file to preview it on the right. */
function FolderTree({
  selected,
  onSelect,
}: {
  selected: FileId;
  onSelect: (id: FileId) => void;
}) {
  const fileRow = (id: FileId) => {
    const f = FILES[id];
    const isSel = selected === id;
    return (
      <button
        type="button"
        onClick={() => onSelect(id)}
        aria-pressed={isSel}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-sm px-1.5 py-1 text-left font-mono text-[12px] transition-colors",
          isSel
            ? "bg-accent-100 font-medium text-accent-800 ring-1 ring-accent-300"
            : "text-fg hover:bg-surface-2",
        )}
      >
        <span className="flex items-center gap-1.5">
          <DocumentTextIcon
            className={cn(
              "h-4 w-4 shrink-0",
              f.accent ? "text-accent-600" : "text-neutral-500",
            )}
            aria-hidden="true"
          />
          {f.filename}
        </span>
        <span className="font-sans text-[10px] text-muted">{f.note}</span>
      </button>
    );
  };

  const row = "flex items-center gap-1.5 px-1.5 py-1 font-mono text-[12px]";
  return (
    <div className="rounded-control border border-line bg-surface p-3 shadow-card">
      <p className="eyebrow mb-2 text-muted">Click a file to preview</p>
      <ul className="space-y-0.5">
        <li className={cn(row, "text-muted")}>
          <FolderIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          OneDrive
        </li>
        <li className="ml-2 border-l border-line pl-2">
          <span className={cn(row, "text-muted")}>
            <FolderIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Documents / Cowork / skills
          </span>
          <ul className="ml-2 border-l border-line pl-2">
            <li>
              <span className={cn(row, "font-medium text-accent-800")}>
                <FolderOpenIcon className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                email-in-my-voice/
              </span>
              <ul className="ml-2 space-y-0.5 border-l border-line pl-2">
                <li>{fileRow("skill")}</li>
                <li>{fileRow("voice")}</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      <p className="mt-2.5 text-xs leading-relaxed text-muted">
        A skill is just a <span className="font-medium text-fg">folder</span>: one{" "}
        <code className="font-mono">SKILL.md</code> plus any files it references.
      </p>
    </div>
  );
}

export function SkillAnatomyScreen() {
  const [selected, setSelected] = useState<FileId>("skill");
  const file = FILES[selected];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Reveal as="p" className="eyebrow">
          Anatomy
        </Reveal>
        <Reveal
          as="h2"
          delay={60}
          className="font-serif text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl"
        >
          A skill is a <span className="mark">folder</span>.
        </Reveal>
        <Reveal
          as="p"
          delay={120}
          className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          One <code className="font-mono text-sm">SKILL.md</code> — a short YAML
          frontmatter block (<code className="font-mono text-sm">name</code>,{" "}
          <code className="font-mono text-sm">description</code>) then a Markdown
          body — plus any supporting files it points to.
        </Reveal>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,300px)_1fr]">
        <Reveal delay={200}>
          <FolderTree selected={selected} onSelect={setSelected} />
        </Reveal>
        <Reveal delay={280}>
          {/* Keyed so it re-mounts (and fades) when you pick a different file. */}
          <div key={selected} className="animate-fade-in">
            <CodePane
              filename={file.filename}
              code={file.code}
              language="markdown"
              maxHeight="17rem"
            />
          </div>
        </Reveal>
      </div>

      <Reveal delay={360}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CALLOUTS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex gap-3 rounded-control border border-line bg-surface p-3.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-accent-50">
                <Icon className="h-4 w-4 text-accent-600" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
