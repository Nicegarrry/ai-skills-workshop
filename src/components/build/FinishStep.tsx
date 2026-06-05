"use client";

/**
 * FinishStep — step 5 of the lab.
 *
 * Recaps what the learner built, reminds them of the four building blocks and
 * the honest governance note, then offers individual Blob downloads of SKILL.md
 * and voice.md (no zip dependency) plus the real OneDrive install path. "Start
 * over" clears persisted state via the parent.
 */
import { useCallback } from "react";
import {
  Badge,
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CodePane,
} from "@/components/ui";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { parseFrontmatter } from "@/lib/skill";
import { cn } from "@/lib/cn";

export type FinishStepProps = {
  skillMd: string;
  voiceMd: string;
  /** Whether the learner ran the bench at least once (drives the recap copy). */
  didRun: boolean;
  onStartOver: () => void;
};

/** Trigger a client-side download of `text` as a named file (no deps). */
function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

const BUILDING_BLOCKS: { term: string; gloss: string }[] = [
  { term: "Custom Skill", gloss: "reusable know-how + files Cowork auto-loads" },
  { term: "Saved Prompt", gloss: "a quick instruction you trigger yourself" },
  { term: "Plugin / connector", gloss: "reaches an external system or data" },
  { term: "Scheduled task", gloss: "an agentic job on a recurring trigger" },
];

export function FinishStep({
  skillMd,
  voiceMd,
  didRun,
  onStartOver,
}: FinishStepProps) {
  const name = parseFrontmatter(skillMd).name?.trim() || "my-skill";
  const installPath = `OneDrive/Documents/Cowork/skills/${name}/`;

  const downloadSkill = useCallback(
    () => downloadText("SKILL.md", skillMd),
    [skillMd],
  );
  const downloadVoice = useCallback(
    () => downloadText("voice.md", voiceMd),
    [voiceMd],
  );

  return (
    <div className="flex animate-fade-up flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Badge tone="ok" className="self-start">
          <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Skill ready
        </Badge>
        <p className="eyebrow">Step 5 · Finish</p>
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          You built a real skill
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          You authored a two-file skill — a{" "}
          <code className="font-mono">SKILL.md</code> with frontmatter and
          instructions, and a <code className="font-mono">voice.md</code>{" "}
          reference file it points at
          {didRun ? ", and watched a model apply it live" : ""}. Download both,
          drop them in OneDrive, and Cowork will discover the skill at the start
          of your next conversation.
        </p>
      </div>

      {/* Downloads */}
      <Card as="section" className="card-lift" aria-label="Download your skill files">
        <CardHeader>
          <CardTitle>Download your files</CardTitle>
        </CardHeader>
        <CardBody className="text-fg">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" onClick={downloadSkill}>
              <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
              Download SKILL.md
            </Button>
            <Button variant="secondary" onClick={downloadVoice}>
              <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
              Download voice.md
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <p className="text-sm font-medium text-fg">Then install them</p>
            <p className="text-sm text-muted">
              Put both files together in a folder named after your skill, inside
              your OneDrive Cowork skills directory. No admin registration is
              needed to author a personal skill — you just drop the file in.
            </p>
            <CodePane
              filename="install path"
              language="text"
              code={`${installPath}\n  ├── SKILL.md\n  └── voice.md`}
              highlight={false}
              copyable={false}
            />
          </div>
        </CardBody>
      </Card>

      {/* The two files, for a final look */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CodePane
          filename="SKILL.md"
          language="markdown"
          code={skillMd}
          maxHeight="20rem"
        />
        <CodePane
          filename="voice.md"
          language="markdown"
          code={voiceMd}
          maxHeight="20rem"
        />
      </div>

      {/* Building-blocks reminder */}
      <Card as="section" className="card-lift" aria-label="The four building blocks">
        <CardHeader>
          <CardTitle>Remember the four building blocks</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="grid gap-2 sm:grid-cols-2">
            {BUILDING_BLOCKS.map((b, i) => (
              <li
                key={b.term}
                className={cn(
                  "flex items-baseline gap-2 rounded-control px-1 py-1.5",
                  i === 0 && "font-medium",
                )}
              >
                <span
                  className={cn(
                    "shrink-0 text-sm",
                    i === 0 ? "text-accent-700" : "text-fg",
                  )}
                >
                  {b.term}
                </span>
                <span className="text-sm text-muted">— {b.gloss}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            Skills teach Cowork <span className="font-medium text-fg">how</span>;
            plugins give it <span className="font-medium text-fg">reach</span> —
            you usually combine them.
          </p>
        </CardBody>
      </Card>

      {/* Governance note (honest) */}
      <Callout tone="warn" title="One honest caveat">
        Custom skills created by users aren&rsquo;t validated by Microsoft.
        Review custom skill outputs carefully — personal-OneDrive skills bypass
        central review. A quick peer review before sharing goes a long way.
      </Callout>

      <div className="flex items-center justify-between border-t border-line pt-5">
        <p className="text-sm text-muted">Want to build another?</p>
        <Button variant="ghost" onClick={onStartOver}>
          <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
          Start over
        </Button>
      </div>
    </div>
  );
}
