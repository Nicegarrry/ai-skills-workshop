import { describe, it, expect } from "vitest";
import {
  assembleSkillMd,
  assembleVoiceMd,
  parseFrontmatter,
  validateSkill,
  buildRunPrompt,
  mockRun,
} from "@/lib/skill";
import type { SkillFields, VoiceFields } from "@/lib/types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const VALID_SKILL: SkillFields = {
  name: "email-in-my-voice",
  description:
    "Use when the user wants to turn a rough draft into a polished email in their own voice.",
  instructions:
    "Read voice.md and rewrite the draft to match the user's tone. Output only the finished email.",
};

const VALID_VOICE: VoiceFields = {
  sampleEmails: "Hi Sam, quick one — deck is on the shared drive. Cheers, Alex",
  toneDescription: "Warm but efficient, no corporate jargon.",
};

// ---------------------------------------------------------------------------
// assembleSkillMd
// ---------------------------------------------------------------------------

describe("assembleSkillMd", () => {
  it("produces valid YAML frontmatter with name and description", () => {
    const md = assembleSkillMd(VALID_SKILL);
    expect(md).toContain("---");
    expect(md).toContain("name: email-in-my-voice");
    expect(md).toContain("description: Use when");
  });

  it("includes the instructions body", () => {
    const md = assembleSkillMd(VALID_SKILL);
    expect(md).toContain("Read voice.md");
  });

  it("appends a voice.md reference when instructions do not already mention it", () => {
    const skill: SkillFields = {
      name: "test-skill",
      description: "Use when testing.",
      instructions: "Do something useful.",
    };
    const md = assembleSkillMd(skill);
    expect(md).toContain("voice.md");
  });

  it("does not duplicate the voice.md reference when instructions already mention it", () => {
    const md = assembleSkillMd(VALID_SKILL);
    const occurrences = (md.match(/voice\.md/g) ?? []).length;
    // Instructions already say "voice.md", so the appended reference line is skipped — 1 occurrence.
    expect(occurrences).toBe(1);
  });

  it("round-trips through parseFrontmatter correctly", () => {
    const md = assembleSkillMd(VALID_SKILL);
    const parsed = parseFrontmatter(md);
    expect(parsed.name).toBe("email-in-my-voice");
    expect(parsed.description).toContain("Use when");
    expect(parsed.body).toContain("Read voice.md");
  });
});

// ---------------------------------------------------------------------------
// assembleVoiceMd
// ---------------------------------------------------------------------------

describe("assembleVoiceMd", () => {
  it("includes a Tone section when toneDescription is provided", () => {
    const md = assembleVoiceMd(VALID_VOICE);
    expect(md).toContain("## Tone");
    expect(md).toContain("Warm but efficient");
  });

  it("includes a Sample writing section when sampleEmails is provided", () => {
    const md = assembleVoiceMd(VALID_VOICE);
    expect(md).toContain("## Sample writing");
    expect(md).toContain("Hi Sam");
  });

  it("omits Tone section when toneDescription is empty", () => {
    const md = assembleVoiceMd({ sampleEmails: "Hello world.", toneDescription: "" });
    expect(md).not.toContain("## Tone");
    expect(md).toContain("## Sample writing");
  });

  it("omits Sample writing section when sampleEmails is empty", () => {
    const md = assembleVoiceMd({ sampleEmails: "", toneDescription: "Crisp and direct." });
    expect(md).toContain("## Tone");
    expect(md).not.toContain("## Sample writing");
  });

  it("starts with a top-level heading", () => {
    const md = assembleVoiceMd(VALID_VOICE);
    expect(md.startsWith("# Voice reference")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseFrontmatter
// ---------------------------------------------------------------------------

describe("parseFrontmatter", () => {
  it("extracts name and description from standard frontmatter", () => {
    const md = "---\nname: my-skill\ndescription: Use when testing.\n---\nThe body.";
    const result = parseFrontmatter(md);
    expect(result.name).toBe("my-skill");
    expect(result.description).toBe("Use when testing.");
    expect(result.body).toBe("The body.");
  });

  it("returns empty name/description and full md as body when no frontmatter", () => {
    const md = "Just a plain body with no frontmatter.";
    const result = parseFrontmatter(md);
    expect(result.name).toBeUndefined();
    expect(result.description).toBeUndefined();
    expect(result.body).toBe(md);
  });

  it("handles leading whitespace before the opening ---", () => {
    const md = "---\nname: trimmed\ndescription: Use when trimmed.\n---\nBody here.";
    const result = parseFrontmatter(`  \n${md}`);
    expect(result.name).toBe("trimmed");
  });

  it("returns body-only when the closing --- delimiter is missing", () => {
    const md = "---\nname: broken\ndescription: broken\nBody without close.";
    const result = parseFrontmatter(md);
    expect(result.name).toBeUndefined();
    expect(result.body).toBe(md);
  });

  it("ignores unknown frontmatter keys", () => {
    const md = "---\nname: my-skill\nversion: 1\nauthor: Alice\ndescription: Use when here.\n---\nBody.";
    const result = parseFrontmatter(md);
    expect(result.name).toBe("my-skill");
    expect(result.description).toBe("Use when here.");
  });
});

// ---------------------------------------------------------------------------
// validateSkill — valid skill passes
// ---------------------------------------------------------------------------

describe("validateSkill — valid skill", () => {
  it("returns all ok findings for a well-formed skill", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });

    const errors = findings.filter((f) => f.level === "error");
    const warns = findings.filter((f) => f.level === "warn");
    expect(errors).toHaveLength(0);
    expect(warns).toHaveLength(0);
    expect(findings.every((f) => f.level === "ok")).toBe(true);
  });

  it("returns a finding for each checked dimension", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const fields = findings.map((f) => f.field);
    expect(fields).toContain("name");
    expect(fields).toContain("description");
    expect(fields).toContain("instructions");
    expect(fields).toContain("size");
    expect(fields).toContain("library");
  });
});

// ---------------------------------------------------------------------------
// validateSkill — missing / short description warns
// ---------------------------------------------------------------------------

describe("validateSkill — description issues", () => {
  it("errors when description is missing from frontmatter", () => {
    const skillMd = "---\nname: my-skill\n---\nSome instructions referencing voice.md.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const descFinding = findings.find((f) => f.field === "description");
    expect(descFinding?.level).toBe("error");
  });

  it("warns when description is too short (fewer than 8 words)", () => {
    const skillMd =
      "---\nname: my-skill\ndescription: Use when short.\n---\nInstructions referencing voice.md here.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const descFinding = findings.find((f) => f.field === "description");
    expect(descFinding?.level).toBe("warn");
    expect(descFinding?.message).toMatch(/short|words/i);
  });

  it("warns when description lacks a trigger cue", () => {
    // Long enough to pass the word-count gate (≥8 words) but has no trigger cue.
    const skillMd =
      "---\nname: my-skill\ndescription: Rewrites any email draft to sound professional polished and clear.\n---\nInstructions referencing voice.md here.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const descFinding = findings.find((f) => f.field === "description");
    expect(descFinding?.level).toBe("warn");
    expect(descFinding?.message).toMatch(/trigger/i);
  });
});

// ---------------------------------------------------------------------------
// validateSkill — non-kebab name errors
// ---------------------------------------------------------------------------

describe("validateSkill — name validation", () => {
  it("errors when name contains uppercase letters", () => {
    const skillMd =
      "---\nname: MySkill\ndescription: Use when testing a bad name.\n---\nBody with voice.md reference.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const nameFinding = findings.find((f) => f.field === "name");
    expect(nameFinding?.level).toBe("error");
  });

  it("errors when name contains spaces", () => {
    const skillMd =
      "---\nname: my skill\ndescription: Use when testing a bad name here.\n---\nBody with voice.md reference.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const nameFinding = findings.find((f) => f.field === "name");
    expect(nameFinding?.level).toBe("error");
  });

  it("errors when name starts with a hyphen", () => {
    const skillMd =
      "---\nname: -bad-name\ndescription: Use when testing an invalid name.\n---\nBody with voice.md reference.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const nameFinding = findings.find((f) => f.field === "name");
    expect(nameFinding?.level).toBe("error");
  });

  it("accepts single-word all-lowercase names", () => {
    const skillMd =
      "---\nname: emailskill\ndescription: Use when testing a single word name that is valid.\n---\nBody with voice.md reference.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const nameFinding = findings.find((f) => f.field === "name");
    expect(nameFinding?.level).toBe("ok");
  });
});

// ---------------------------------------------------------------------------
// validateSkill — body without voice.md reference warns
// ---------------------------------------------------------------------------

describe("validateSkill — voice.md reference", () => {
  it("warns when body does not reference voice.md", () => {
    const skillMd =
      "---\nname: my-skill\ndescription: Use when testing the voice reference warning.\n---\nRewrite the draft to sound polished.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const instrFinding = findings.find((f) => f.field === "instructions");
    expect(instrFinding?.level).toBe("warn");
    expect(instrFinding?.message).toMatch(/voice\.md/i);
  });

  it("passes when body references voice.md", () => {
    const skillMd =
      "---\nname: my-skill\ndescription: Use when testing the voice reference passing case.\n---\nRead voice.md and rewrite the draft.";
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const instrFinding = findings.find((f) => f.field === "instructions");
    expect(instrFinding?.level).toBe("ok");
  });
});

// ---------------------------------------------------------------------------
// validateSkill — oversize errors
// ---------------------------------------------------------------------------

describe("validateSkill — size limits", () => {
  it("errors when combined skill + voice file exceeds 1 MB", () => {
    const big = "x".repeat(1_100_000);
    const findings = validateSkill({ skillMd: big, voiceMd: "" });
    const sizeFinding = findings.find((f) => f.field === "size");
    expect(sizeFinding?.level).toBe("error");
  });

  it("passes when combined size is under the limit", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd });
    const sizeFinding = findings.find((f) => f.field === "size");
    expect(sizeFinding?.level).toBe("ok");
  });

  it("errors when librarySize exceeds 50", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd, librarySize: 51 });
    const libFinding = findings.find((f) => f.field === "library");
    expect(libFinding?.level).toBe("error");
  });

  it("passes when librarySize is exactly 50", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const findings = validateSkill({ skillMd, voiceMd, librarySize: 50 });
    const libFinding = findings.find((f) => f.field === "library");
    expect(libFinding?.level).toBe("ok");
  });
});

// ---------------------------------------------------------------------------
// buildRunPrompt
// ---------------------------------------------------------------------------

describe("buildRunPrompt", () => {
  it("includes the skill md in the system prompt", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const { system } = buildRunPrompt({ skillMd, voiceMd, draft: "rough draft", instruction: "/skill go" });
    expect(system).toContain(skillMd);
  });

  it("includes the voice md in the system prompt", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const { system } = buildRunPrompt({ skillMd, voiceMd, draft: "rough draft", instruction: "/skill go" });
    expect(system).toContain(voiceMd);
  });

  it("includes the draft in the user message", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const draft = "This is a rough draft about the project deadline.";
    const { user } = buildRunPrompt({ skillMd, voiceMd, draft, instruction: "/skill polish" });
    expect(user).toContain(draft);
  });

  it("includes the instruction in the user message", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const instruction = "/skill polish this for my Monday update";
    const { user } = buildRunPrompt({ skillMd, voiceMd, draft: "draft text", instruction });
    expect(user).toContain(instruction);
  });

  it("produces non-empty system and user when all fields are empty strings", () => {
    const { system, user } = buildRunPrompt({ skillMd: "", voiceMd: "", draft: "", instruction: "" });
    expect(system.length).toBeGreaterThan(0);
    expect(user.length).toBeGreaterThan(0);
  });

  it("scopes the model to output only the finished email", () => {
    const { system } = buildRunPrompt({
      skillMd: assembleSkillMd(VALID_SKILL),
      voiceMd: assembleVoiceMd(VALID_VOICE),
      draft: "test",
      instruction: "/skill go",
    });
    expect(system).toContain("finished email");
    expect(system).toContain("no commentary");
  });
});

// ---------------------------------------------------------------------------
// mockRun
// ---------------------------------------------------------------------------

describe("mockRun", () => {
  it("returns a string shaped like an email (subject, greeting, sign-off)", () => {
    const skillMd = assembleSkillMd(VALID_SKILL);
    const voiceMd = assembleVoiceMd(VALID_VOICE);
    const output = mockRun({ skillMd, voiceMd, draft: "hey quick update on the project.", instruction: "/skill go" });
    expect(output).toContain("Subject:");
    expect(output).toContain("Hi,");
    expect(output).toMatch(/Best,|Regards,|Cheers,/i);
  });

  it("is deterministic — same inputs always produce the same output", () => {
    const args = {
      skillMd: assembleSkillMd(VALID_SKILL),
      voiceMd: assembleVoiceMd(VALID_VOICE),
      draft: "Identical draft text for determinism test.",
      instruction: "/skill apply",
    };
    expect(mockRun(args)).toBe(mockRun(args));
  });

  it("labels the output as demo mode", () => {
    const output = mockRun({
      skillMd: assembleSkillMd(VALID_SKILL),
      voiceMd: assembleVoiceMd(VALID_VOICE),
      draft: "rough draft here",
      instruction: "/skill go",
    });
    expect(output).toContain("demo mode");
  });

  it("includes the skill name in the output footer", () => {
    const output = mockRun({
      skillMd: assembleSkillMd(VALID_SKILL),
      voiceMd: assembleVoiceMd(VALID_VOICE),
      draft: "draft",
      instruction: "/skill go",
    });
    expect(output).toContain("email-in-my-voice");
  });

  it("handles an empty draft gracefully without throwing", () => {
    expect(() =>
      mockRun({
        skillMd: assembleSkillMd(VALID_SKILL),
        voiceMd: assembleVoiceMd(VALID_VOICE),
        draft: "",
        instruction: "/skill go",
      }),
    ).not.toThrow();
  });

  it("handles missing skill name (no frontmatter) gracefully", () => {
    const output = mockRun({ skillMd: "No frontmatter here.", voiceMd: "", draft: "some draft", instruction: "/skill go" });
    expect(output).toContain("your skill");
  });
});
