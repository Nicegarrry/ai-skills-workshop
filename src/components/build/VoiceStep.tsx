/**
 * VoiceStep — step 2 of the lab: capture the learner's voice into `voice.md`.
 *
 * Two guided inputs (sample emails + a one-line tone description) assemble a
 * `voice.md` reference file live on the right via `assembleVoiceMd`. This is the
 * teaching moment for multi-file skills + progressive disclosure: the heavy
 * voice detail lives in voice.md, and the SKILL.md just points at it.
 */
import { Callout, CodePane, TextField } from "@/components/ui";
import { assembleVoiceMd } from "@/lib/skill";
import { getScenario } from "@/lib/scenarios";
import type { VoiceFields } from "@/lib/types";

export type VoiceStepProps = {
  scenarioId: string;
  voice: VoiceFields;
  onChange: (patch: Partial<VoiceFields>) => void;
};

export function VoiceStep({ scenarioId, voice, onChange }: VoiceStepProps) {
  const scenario = getScenario(scenarioId);
  const voiceMd = assembleVoiceMd(voice);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          Capture your voice
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Give the model a couple of real examples and a one-line description of
          your tone. We assemble a <code className="font-mono">voice.md</code>{" "}
          reference file as you type — your SKILL.md will point at it, so the
          heavy detail stays out of the way until it&rsquo;s needed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="flex flex-col gap-5">
          <TextField
            label={scenario.voicePrompts.sampleLabel}
            hint="Real examples teach the model far more than adjectives. One or two is plenty."
            rows={10}
            value={voice.sampleEmails}
            onChange={(e) => onChange({ sampleEmails: e.target.value })}
            placeholder={"Hi Sam,\n\nQuick one — ..."}
            spellCheck={false}
            className="font-mono text-[13px]"
          />
          <TextField
            label={scenario.voicePrompts.toneLabel}
            hint="e.g. warm but efficient, conversational, no corporate jargon."
            rows={3}
            value={voice.toneDescription}
            onChange={(e) => onChange({ toneDescription: e.target.value })}
            placeholder="Warm, concise, gets to the point fast."
          />

          <Callout tone="info" title="Why a separate file?">
            A skill can bundle supporting files. Keeping the voice detail in{" "}
            <code className="font-mono">voice.md</code> keeps the SKILL.md short
            and readable, and lets you reuse the same voice across skills.
          </Callout>
        </div>

        {/* Live preview */}
        <div className="flex flex-col gap-2 lg:sticky lg:top-6 lg:self-start">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Live preview
          </p>
          <CodePane
            filename="voice.md"
            language="markdown"
            code={voiceMd}
            maxHeight="28rem"
          />
        </div>
      </div>
    </div>
  );
}
