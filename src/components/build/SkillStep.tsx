/**
 * SkillStep — step 3 of the lab: author the `SKILL.md`.
 *
 * Guided fields (name / description / instructions) with live coaching:
 *  - name is live-formatted toward kebab-case and shows a fix hint,
 *  - description gets trigger-word coaching ("start with Use when…"),
 *  - instructions are prefilled and must reference voice.md.
 * The SKILL.md preview assembles live via `assembleSkillMd`, and the
 * ValidatorPanel runs the authoritative `validateSkill` over the assembled
 * SKILL.md + voice.md so ✓/⚠/✗ rows reflect exactly what would install.
 */
import { Badge, Callout, CodePane, Field, TextField } from "@/components/ui";
import { ValidatorPanel } from "@/components/build/ValidatorPanel";
import { assembleSkillMd, assembleVoiceMd, validateSkill } from "@/lib/skill";
import type { Finding, SkillFields, VoiceFields } from "@/lib/types";

export type SkillStepProps = {
  skill: SkillFields;
  voice: VoiceFields;
  onChange: (patch: Partial<SkillFields>) => void;
};

/** Cowork loads a skill when the task matches its description, so descriptions
 *  should open with a trigger cue. Mirror that cue check for live coaching. */
const TRIGGER_CUE = /\b(use\s+when|when\s+the\s+user|when\s+you|when\b)/i;

/** Nudge typed text toward kebab-case for the live hint (validateSkill is the
 *  source of truth; this only powers the inline coaching, not the value). */
function toKebabPreview(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function descriptionHint(description: string): {
  tone: "ok" | "muted";
  text: string;
} {
  const words = description.trim().split(/\s+/).filter(Boolean).length;
  if (!TRIGGER_CUE.test(description)) {
    return {
      tone: "muted",
      text: "Start with a trigger cue like “Use when…” and name the task — that's how Cowork knows when to load this skill.",
    };
  }
  if (words < 8) {
    return {
      tone: "muted",
      text: "Add a little more — name the inputs and the outcome so the match is unambiguous.",
    };
  }
  return { tone: "ok", text: "Good — clear trigger and enough detail to match on." };
}

export function SkillStep({ skill, voice, onChange }: SkillStepProps) {
  const skillMd = assembleSkillMd(skill);
  const voiceMd = assembleVoiceMd(voice);
  const findings: Finding[] = validateSkill({ skillMd, voiceMd });

  const kebab = toKebabPreview(skill.name);
  const nameNeedsFix = skill.name.length > 0 && kebab !== skill.name;
  const descHint = descriptionHint(skill.description);

  return (
    <div className="flex animate-fade-up flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">Step 3 · SKILL.md</p>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Write the skill
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          A skill is Markdown with a little YAML frontmatter:{" "}
          <code className="font-mono">name</code> and{" "}
          <code className="font-mono">description</code>, then your instructions.
          The description is doing the heavy lifting — Cowork auto-discovers
          skills and loads this one when a task matches it.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs + validator */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Field
              label="Skill name"
              required
              hint="kebab-case — lowercase words joined by hyphens. Also the OneDrive folder name."
              value={skill.name}
              onChange={(e) => onChange({ name: e.target.value })}
              onBlur={() => {
                // Normalize to kebab-case on blur so the learner sees the
                // canonical form, without fighting their keystrokes mid-edit.
                if (nameNeedsFix) onChange({ name: kebab });
              }}
              placeholder="email-in-my-voice"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="font-mono"
            />
            {nameNeedsFix && (
              <button
                type="button"
                onClick={() => onChange({ name: kebab })}
                className="self-start text-xs font-medium text-accent-700 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                Fix to{" "}
                <code className="font-mono">{kebab || "your-skill-name"}</code>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <TextField
              label="Description"
              required
              hint="This is the discovery text. Quality here = whether Cowork finds your skill."
              rows={3}
              value={skill.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Use when the user wants to turn a rough draft into a finished email in their own voice."
            />
            <p
              className={
                descHint.tone === "ok"
                  ? "text-xs font-medium text-ok-700"
                  : "text-xs text-muted"
              }
            >
              {descHint.text}
            </p>
          </div>

          <TextField
            label="Instructions"
            required
            hint="How the skill should behave. Must reference voice.md so the model reads it."
            rows={10}
            value={skill.instructions}
            onChange={(e) => onChange({ instructions: e.target.value })}
            placeholder="Read voice.md, then rewrite the draft into a finished email…"
            className="font-mono text-[13px]"
          />

          <Callout tone="warn" title="Keep skills under the limits">
            Cowork allows up to 50 custom skills, each up to 1 MB. The validator
            tracks size for you.
          </Callout>

          <ValidatorPanel findings={findings} />
        </div>

        {/* Live preview */}
        <div className="flex flex-col gap-2 lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Live preview
            </p>
            <Badge tone="neutral">
              {new Blob([skillMd]).size.toLocaleString()} bytes
            </Badge>
          </div>
          <CodePane
            filename="SKILL.md"
            language="markdown"
            code={skillMd}
            maxHeight="34rem"
          />
        </div>
      </div>
    </div>
  );
}
