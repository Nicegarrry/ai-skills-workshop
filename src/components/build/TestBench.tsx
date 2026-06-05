"use client";

/**
 * TestBench — step 4 of the lab and the payoff.
 *
 * Left: an editable messy draft + a slash-command-style instruction input.
 * Run → POST /api/run-skill with { skillMd, voiceMd, draft, instruction,
 * scenarioId }. Right: the finished email the model produced by applying the
 * learner's skill, under a "Cowork loaded <name> (matched your description) →
 * applied voice.md" trace line that reinforces the discovery model.
 *
 * The learner can also tweak voice.md / SKILL.md inline (collapsible editors)
 * and re-run to watch the output improve. Handles loading + error states and
 * labels MOCK-mode output ("demo mode — configure a model key for live
 * results"). SKILL.md / voice.md are assembled from the current fields by the
 * parent and passed in, so the request always reflects the latest edits.
 */
import { useCallback, useRef, useState } from "react";
import {
  Badge,
  Button,
  Callout,
  CodePane,
  Field,
  TextField,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  PlayIcon,
  SparklesIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import { parseFrontmatter } from "@/lib/skill";
import type {
  LastResult,
  RunSkillRequest,
  RunSkillResponse,
  SkillFields,
  VoiceFields,
} from "@/lib/types";

export type TestBenchProps = {
  scenarioId: string;
  skill: SkillFields;
  voice: VoiceFields;
  skillMd: string;
  voiceMd: string;
  draft: string;
  instruction: string;
  lastResult: LastResult | null;
  onDraftChange: (value: string) => void;
  onInstructionChange: (value: string) => void;
  onSkillChange: (patch: Partial<SkillFields>) => void;
  onVoiceChange: (patch: Partial<VoiceFields>) => void;
  onResult: (result: LastResult) => void;
};

export function TestBench({
  scenarioId,
  skill,
  voice,
  skillMd,
  voiceMd,
  draft,
  instruction,
  lastResult,
  onDraftChange,
  onInstructionChange,
  onSkillChange,
  onVoiceChange,
  onResult,
}: TestBenchProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorsOpen, setEditorsOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // The discovery name shown in the trace line — parsed from the actual
  // SKILL.md frontmatter so it always matches what the model received.
  const loadedName = parseFrontmatter(skillMd).name?.trim() || skill.name;

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const body: RunSkillRequest = {
        skillMd,
        voiceMd,
        draft,
        instruction,
        scenarioId,
      };
      const res = await fetch("/api/run-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      let data: RunSkillResponse;
      try {
        data = (await res.json()) as RunSkillResponse;
      } catch {
        throw new Error(
          res.status === 429
            ? "You've run this a lot in a short window — give it a minute and try again."
            : `The run failed (HTTP ${res.status}). Try again in a moment.`,
        );
      }

      if (!data.ok) {
        throw new Error(data.error || "The run failed. Try again in a moment.");
      }

      onResult({
        output: data.output,
        mode: data.mode,
        model: data.model,
        at: Date.now(),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong running your skill.",
      );
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  }, [skillMd, voiceMd, draft, instruction, scenarioId, onResult]);

  const hasRun = !!lastResult;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          Test bench
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Here&rsquo;s a messy draft. Describe what you want — like you would to
          Cowork — and run it. The model loads your skill, reads{" "}
          <code className="font-mono">voice.md</code>, and returns a finished
          result. Don&rsquo;t love it? Edit the skill below and run again.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input column */}
        <div className="flex flex-col gap-5">
          <TextField
            label="Messy draft"
            hint="This is the rough input handed to your skill. Edit it freely."
            rows={9}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            spellCheck={false}
            className="font-mono text-[13px]"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="testbench-command"
              className="text-sm font-medium text-fg"
            >
              Invoke your skill
            </label>
            <div
              className={cn(
                "flex items-center gap-2 rounded-control border border-line-strong bg-surface px-3",
                "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-500",
              )}
            >
              <CommandLineIcon
                className="h-4 w-4 shrink-0 text-accent-600"
                aria-hidden="true"
              />
              <input
                id="testbench-command"
                type="text"
                value={instruction}
                onChange={(e) => onInstructionChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    e.preventDefault();
                    void run();
                  }
                }}
                placeholder="/skill polish this for my Monday update"
                spellCheck={false}
                className="h-11 w-full bg-transparent font-mono text-sm text-fg placeholder:text-neutral-400 focus-visible:outline-none"
              />
            </div>
            <p className="text-xs text-muted">
              In real Cowork you&rsquo;d just describe the task — discovery picks
              the skill for you. This slash style makes the &ldquo;invoke&rdquo;
              explicit for the demo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => void run()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ArrowPathIcon
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Running…
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5" aria-hidden="true" />
                  {hasRun ? "Run again" : "Run skill"}
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={() => setEditorsOpen((v) => !v)}
              aria-expanded={editorsOpen}
              aria-controls="tweak-editors"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 transition-transform",
                  editorsOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
              Tweak the skill
            </button>
          </div>

          {editorsOpen && (
            <div
              id="tweak-editors"
              className="flex flex-col gap-5 rounded-card border border-line bg-surface-2 p-4"
            >
              <p className="text-xs leading-relaxed text-muted">
                Adjust the voice or the instructions, then run again to compare.
                These edits update the same SKILL.md / voice.md you&rsquo;ll
                download.
              </p>
              <Field
                label="description"
                hint="Discovery text — what makes Cowork load this skill."
                value={skill.description}
                onChange={(e) => onSkillChange({ description: e.target.value })}
                spellCheck={false}
              />
              <TextField
                label="instructions"
                rows={6}
                value={skill.instructions}
                onChange={(e) =>
                  onSkillChange({ instructions: e.target.value })
                }
                spellCheck={false}
                className="font-mono text-[13px]"
              />
              <TextField
                label="tone (voice.md)"
                rows={2}
                value={voice.toneDescription}
                onChange={(e) =>
                  onVoiceChange({ toneDescription: e.target.value })
                }
              />
            </div>
          )}
        </div>

        {/* Output column */}
        <div
          className="flex flex-col gap-3 lg:sticky lg:top-6 lg:self-start"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Result
          </p>

          <ResultPanel
            loading={loading}
            error={error}
            result={lastResult}
            loadedName={loadedName}
            onRetry={() => void run()}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Result panel (trace line + output / states) ---------- */

function ResultPanel({
  loading,
  error,
  result,
  loadedName,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  result: LastResult | null;
  loadedName: string;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-card border border-line bg-surface p-8 text-center shadow-card">
        <SparklesIcon
          className="h-7 w-7 animate-pulse text-accent-500"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-fg">Cowork is applying your skill…</p>
        <p className="text-xs text-muted">
          Loading <span className="font-mono">{loadedName}</span> → reading
          voice.md → writing the result.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Callout tone="warn" title="Couldn't complete the run">
        <p>{error}</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onRetry}
        >
          <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      </Callout>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-[18rem] flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line-strong bg-surface p-8 text-center">
        <PlayIcon className="h-7 w-7 text-muted" aria-hidden="true" />
        <p className="text-sm font-medium text-fg">No result yet</p>
        <p className="max-w-xs text-xs text-muted">
          Edit the draft and the command, then hit{" "}
          <span className="font-medium text-fg">Run skill</span> to see your
          skill in action.
        </p>
      </div>
    );
  }

  const isMock = result.mode === "mock";

  return (
    <div className="flex flex-col gap-3">
      {/* Trace line — reinforces the discovery model */}
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-control border border-line bg-surface-2 px-3 py-2 text-xs text-muted">
        <SparklesIcon
          className="h-3.5 w-3.5 shrink-0 text-accent-600"
          aria-hidden="true"
        />
        <span>Cowork loaded</span>
        <span className="font-mono font-medium text-fg">{loadedName}</span>
        <span>(matched your description)</span>
        <span aria-hidden="true">→</span>
        <span>
          applied <span className="font-mono">voice.md</span>
        </span>
        {isMock ? (
          <Badge tone="warn" className="ml-auto">
            Demo mode
          </Badge>
        ) : (
          <Badge tone="ok" className="ml-auto">
            Live{result.model ? ` · ${result.model}` : ""}
          </Badge>
        )}
      </div>

      <CodePane
        filename={isMock ? "result.txt (demo)" : "result.txt"}
        language="text"
        code={result.output}
        highlight={false}
        maxHeight="32rem"
      />

      {isMock && (
        <Callout tone="info">
          Demo mode — configure a model key for live results. This output came
          from a deterministic local transform so the bench works with no key.
        </Callout>
      )}
    </div>
  );
}
