import type { SkillFields, VoiceFields } from "@/lib/types";

/**
 * Scenario data for the build lab.
 *
 * Scenarios are pure data so more can be added without touching the lab UI.
 * The builder seeds its fields from the chosen scenario but every field stays
 * editable. `email-in-my-voice` is the flagship (shipped fully);
 * `meeting-notes-to-actions` proves the same machinery generalizes.
 */
export type Scenario = {
  id: string;
  /** Short title, e.g. "Email in my voice". */
  title: string;
  /** One line shown on the goal step. */
  blurb: string;
  /** Default kebab-case skill name. */
  defaultSkillName: string;
  /** Default discovery description (starts with a trigger cue). */
  defaultDescription: string;
  /** Default instructions body — MUST reference voice.md. */
  defaultInstructions: string;
  /** Labels for the two voice-capture inputs on the voice step. */
  voicePrompts: { sampleLabel: string; toneLabel: string };
  /** Default sample-email paste seeded into the voice step. */
  defaultSampleEmails: string;
  /** Default one-line tone description seeded into the voice step. */
  defaultToneDescription: string;
  /** The messy draft handed to the learner in the test bench (editable). */
  sampleDraft: string;
  /** Prefilled slash command in the test bench, e.g. "/skill polish for my team". */
  sampleCommand: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "email-in-my-voice",
    title: "Email in my voice",
    blurb:
      "Build a skill that rewrites any rough draft into a polished email that sounds like you — then test it live.",
    defaultSkillName: "email-in-my-voice",
    defaultDescription:
      "Use when the user wants to turn a rough draft, notes, or bullet points into a finished email written in their own voice.",
    defaultInstructions: `You rewrite the user's rough draft into a finished, ready-to-send email that sounds like them.

Steps:
1. Read voice.md to learn the user's tone, vocabulary, and signature habits.
2. Rewrite the draft to carry that voice — match warmth, sentence length, and formality. Do not invent facts the draft does not contain.
3. Keep it tight: lead with the point, cut filler, and use short paragraphs.
4. Add a fitting subject line, a natural greeting, and a sign-off consistent with voice.md.
5. Fix grammar and spelling. Preserve any names, dates, numbers, and links exactly.

Output only the finished email (subject line, body, sign-off) — no commentary.`,
    voicePrompts: {
      sampleLabel: "Paste one or two emails you've actually written",
      toneLabel: "Describe your tone in a sentence",
    },
    defaultSampleEmails: `Hi Sam,

Quick one — I've pushed the deck to the shared drive. Two slides still need the Q3 numbers, which I'll have by Thursday. Shout if you want to walk through it before then.

Cheers,
Alex`,
    defaultToneDescription:
      "Warm but efficient, conversational, no corporate jargon, gets to the point fast.",
    sampleDraft: `hey so re the thing we talked about — i looked into the vendor and honestly the pricing is all over the place. cheapest is northstar at like 4k/mo but their support is rough (saw a bunch of complaints). the other one, brightline, is 6.5k but includes onboarding + a dedicated rep. i think brightline is worth it tbh but wanted ur take before i loop in finance. also they need an answer by fri. lmk`,
    sampleCommand: "/skill polish this for my Monday update",
  },
  {
    id: "meeting-notes-to-actions",
    title: "Meeting notes → action list",
    blurb:
      "Build a skill that turns messy meeting notes into a crisp, owner-tagged action list — then test it live.",
    defaultSkillName: "meeting-notes-to-actions",
    defaultDescription:
      "Use when the user pastes raw meeting notes and wants a clear list of decisions and action items with owners and due dates.",
    defaultInstructions: `You turn raw meeting notes into a crisp, scannable summary.

Steps:
1. Read voice.md so the summary matches the user's tone and house style.
2. Produce three sections: Decisions, Action items, Open questions.
3. For each action item, capture the task, the owner, and a due date when one is stated. Use "owner: TBD" or "due: TBD" when missing — never invent them.
4. Keep each item to one short line. Order action items by due date when possible.
5. Strip chit-chat and tangents. Preserve names, numbers, and dates exactly.

Output only the formatted summary — no preamble.`,
    voicePrompts: {
      sampleLabel: "Paste a summary you've written before (or leave blank)",
      toneLabel: "Describe the style you want",
    },
    defaultSampleEmails: `Decisions
- Ship the beta to the design partners on the 14th.

Action items
- Priya: finalise the onboarding email — due Thu
- Marco: stand up the staging env — due Fri

Open questions
- Do we gate analytics behind a flag for the partners?`,
    defaultToneDescription:
      "Crisp and neutral, bulleted, owner and due date on every action, no filler.",
    sampleDraft: `ok so on the call — priya said the onboarding flow is basically done but the welcome email copy is still rough, she'll take that, probably by end of week? marco mentioned staging is still flaky, he wants to rebuild it, no firm date but said "soon". we agreed to ship the beta to design partners on the 14th. oh and someone (dana?) asked whether we should put analytics behind a feature flag for the partners — didn't really resolve that. also need to decide on pricing for the paid tier but ran out of time, push to next week.`,
    sampleCommand: "/skill turn these into an action list",
  },
];

/** The scenario the lab opens with. */
export const DEFAULT_SCENARIO_ID = SCENARIOS[0].id;

/** Look up a scenario by id; falls back to the default when unknown/missing. */
export function getScenario(id: string | undefined): Scenario {
  return (
    SCENARIOS.find((s) => s.id === id) ??
    SCENARIOS.find((s) => s.id === DEFAULT_SCENARIO_ID)!
  );
}

/** Seed the editable SKILL.md fields from a scenario's defaults. */
export function skillFieldsFromScenario(scenario: Scenario): SkillFields {
  return {
    name: scenario.defaultSkillName,
    description: scenario.defaultDescription,
    instructions: scenario.defaultInstructions,
  };
}

/** Seed the editable voice.md fields from a scenario's defaults. */
export function voiceFieldsFromScenario(scenario: Scenario): VoiceFields {
  return {
    sampleEmails: scenario.defaultSampleEmails,
    toneDescription: scenario.defaultToneDescription,
  };
}
