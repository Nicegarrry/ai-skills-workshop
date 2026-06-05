# AI Skills Workshop — Build Brief (single source of truth)

> Interactive training site that teaches business users to **build a Microsoft 365
> Copilot Cowork skill**, then lets them **test and refine it in a fully virtual
> environment** against a real LLM. Public, no login. Deploys to Vercel.
>
> Audience: enterprise consulting clients (non-developers). Tone: confident, plain,
> hands-on. Theme of the whole product: *learn just enough, then DO.*

This brief is the contract for every build agent. **Do not invent Microsoft Cowork
features** — only state facts from §4. Build against the component + API contracts in
§10/§9 so parallel work stays coherent.

---

## 1. Product & goals

Two modules:

1. **Learn** (`/learn`) — *just enough theory.* What Cowork is, why a "skill" beats a
   one-off prompt, the four building blocks, and the anatomy of a `SKILL.md`. One
   focused scrollable page. ~5 minutes.
2. **Build** (`/build`) — *the lab, the centerpiece.* A guided, multi-step builder where
   the learner authors a **two-file skill** (`SKILL.md` + `voice.md`) for the scenario
   **"write an email in my voice,"** then drops into a **virtual test bench**: they're
   handed a messy draft, "invoke" their skill via a slash-command-style input, and a
   **real LLM call applies their skill** and returns the result. They edit the skill,
   re-run, and watch it improve. Finish → **download the skill files** + how-to-install.

Success = a non-technical visitor leaves with (a) a correct mental model of skills vs
prompts vs plugins vs agents, and (b) a real `SKILL.md` + `voice.md` they built and saw
work, downloaded to their machine.

## 2. Hard constraints

- **Frontend-first.** No database, no auth, no user accounts. All workshop state lives in
  the browser (`localStorage`). The visitor can refresh and resume.
- **Exactly one server surface:** a single Next.js Route Handler `POST /api/run-skill`
  that proxies the LLM call (required to keep the API key server-side). Nothing else
  server-side. No persistence of user input beyond the request.
- **Public + cost-aware.** Anyone can visit. The API route must cap input size, cap
  output tokens, and apply best-effort per-IP rate limiting. If no provider key is
  configured, fall back to **MOCK mode** (a deterministic local transform) so the demo
  still works.
- Deploys cleanly to **Vercel** with zero config beyond one env var.

## 3. Tech stack & decisions

- **Next.js 16.2.7, App Router, TypeScript, React 19** (already scaffolded).
- **Tailwind CSS v4** (already configured via `@tailwindcss/postcss`; tokens live in
  `src/app/globals.css` using the v4 `@theme` inline approach — DO consult current
  Tailwind v4 docs via context7 before writing config).
- **Vercel AI SDK** for the LLM call — provider-swappable:
  - `ai`, `@ai-sdk/anthropic`, `@ai-sdk/google` (installed by the foundation step).
  - Provider chosen at request time by env (see §9). **Consult the current ai-sdk docs
    (context7 `/vercel/ai` or sdk.vercel.ai) before writing the call** — the API
    surface changes; do not rely on memory.
- **Icons:** `@heroicons/react` (24px outline). Never Unicode glyphs as icons.
- **No heavy deps.** No JSZip (download files individually via Blob). Syntax highlighting
  is hand-rolled / lightweight (a styled `<pre>` with minimal token coloring is fine).
- **Tests:** `vitest` for the pure functions in §8 (the only logic worth unit-testing).
- Model defaults (override with `WORKSHOP_MODEL`): Anthropic → `claude-sonnet-4-6`;
  Google → `gemini-2.5-flash`. Verify exact model-id strings against current docs.

## 4. Verified Microsoft 365 Copilot Cowork facts (THE ONLY facts you may state)

Source of truth (cite these in the site footer / "sources"):
- Microsoft Learn — *Copilot Cowork FAQ*: https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-faq
- Microsoft 365 Blog (5 May 2026): https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/copilot-cowork-from-conversation-to-action-across-skills-integrations-and-devices/

Facts (accurate as of **June 2026; Cowork is in preview, gated behind the Frontier
program** — the site must carry a small "verify against current Microsoft docs" note):

- **What Cowork is:** an *agentic* AI coworker inside Microsoft 365 that performs
  **multi-step, long-running tasks** (minutes→hours), runs **asynchronously in the
  cloud** (keeps working after you close your laptop). This is different from standard
  **Copilot Chat**, which is synchronous and answers in seconds→minutes.
- **Custom Skills** are authored as a **`SKILL.md`** file: Markdown body + YAML
  frontmatter with **`name`** and **`description`**, then instructions.
- **Storage path:** a subfolder of OneDrive **`/Documents/Cowork/skills/<skill-name>/SKILL.md`**
  (e.g. `/Documents/Cowork/skills/weekly-report/SKILL.md`). A skill folder can contain
  **supporting files** the SKILL.md references (this is how a `voice.md` reference file
  works — multi-file skills).
- **Limits:** up to **50 custom skills**; each skill file up to **1 MB**.
- **Discovery:** skills are **auto-discovered at the start of each conversation**; Cowork
  loads a skill when the task matches its **description** (so description quality =
  discoverability — teach this hard).
- **No admin registration needed** to author a personal skill — you just drop the file in
  OneDrive.
- **Governance gap (state honestly):** *"Custom skills created by users aren't validated
  by Microsoft. Review custom skill outputs carefully."* Personal-OneDrive skills bypass
  central review.
- **Built-in skills** (examples to name): Word, Excel, PowerPoint, PDF, Email,
  Scheduling, Calendar Management, Meetings, Daily Briefing, Enterprise Search,
  Communications, Deep Research, Adaptive Cards.
- **Plugins/connectors:** installed from the **Microsoft 365 App Store**; orgs can build
  custom plugins. (Mention lightly; not the focus.)
- **Grounding:** Cowork is grounded in **Work IQ** + the user's own OneDrive/SharePoint
  files (inherits user permissions). It **cannot** access local files.
- Cowork uses **Anthropic models** as a subprocessor.

**The portable-format hook (use in Learn):** the `SKILL.md` format (Markdown + YAML
frontmatter `name`/`description`) is an **open convention shared across Microsoft Cowork,
GitHub Copilot, and Anthropic Claude** — even the same idea of a skills folder. So skill
craft learned here transfers across tools. (Frame as "an emerging open pattern," not a
formal spec body.)

## 5. Information architecture

| Route | Purpose |
|---|---|
| `/` | Landing. One screen: what this is, the promise ("build a real Cowork skill in 10 min and watch it run"), Start CTA → `/learn`. Minimal. |
| `/learn` | Module 1. Scrollable sections (see §6). Sticky "Next → Build the skill" CTA. |
| `/build` | Module 2. The lab (see §7). Stepper with localStorage persistence. |
| `/api/run-skill` | The only server route (see §9). |

Shared: a top nav (Workshop name, Learn / Build, a progress dot), a footer (sources +
preview disclaimer). Keep nav minimal.

## 6. Module 1 — Learn (content spec)

Light, scannable, build-oriented. Sections:

1. **Meet Cowork** — agentic coworker vs Copilot Chat (async, long-running). A compact
   comparison table (Chat vs Cowork). 3-4 rows.
2. **Why a *skill*, not just a prompt** — a one-off prompt is typed each time and
   forgotten; a skill is a reusable, auto-discovered capability you author once. This is
   the motivating idea for the whole workshop.
3. **The four building blocks** — a decision strip mapping the mental model to Cowork's
   own terms. Present as four cards + a one-line "reach for this when":
   - **Custom Skill** — reusable know-how + files Cowork auto-loads ("the brain").
   - **Saved Prompt** — a quick reusable instruction you trigger yourself ("a shortcut").
   - **Plugin / connector** — reaches an external system/data ("the hands").
   - **Scheduled task** — an agentic job that runs on a recurring trigger ("set & forget").
   One-liner: *skills teach Cowork **how**; plugins give it **reach**; you usually combine
   them.*
4. **Anatomy of a SKILL.md** — annotated example showing frontmatter (`name`,
   `description`), the body/instructions, and a referenced `voice.md` file. Call out: the
   OneDrive path, the 50-skill / 1 MB limits, auto-discovery via description, and that a
   skill can bundle supporting files (segue to the lab, which builds exactly this).
5. **Who owns skills (lightly)** — domain experts author the skills closest to their work
   (not central IT); a quick peer review before sharing; and the honest governance gap
   (personal skills aren't validated by Microsoft — review outputs). 3 short bullets.
6. **CTA →** "Now build one." → `/build`.

Keep each section tight (a card or two). No walls of text.

## 7. Module 2 — Build (the lab) flow spec

A stepper. Persist `workshopState` to `localStorage` on every change; restore on load.
Primary scenario: **"Write an email in my voice."** Architect scenarios as **data**
(§11) so more can be added; ship at least the email scenario fully, plus one secondary
scenario stub that reuses the same machinery.

Steps:

1. **The goal** — frame the scenario: "You'll build a skill that rewrites any rough draft
   into a polished email that sounds like *you* — then test it live." Show what they'll
   walk away with.
2. **Capture your voice (`voice.md`)** — guided: a couple of inputs — "Paste one or two
   emails you've actually written" (textarea) and/or "Describe your tone in a sentence"
   (e.g. warm, concise, no jargon). Assemble a **`voice.md`** reference file live on the
   right. Teaches multi-file skills + progressive disclosure (the heavy voice detail
   lives in voice.md, the SKILL.md just points to it).
3. **Write the skill (`SKILL.md`)** — guided fields:
   - **name** (kebab-case; live-format + validate),
   - **description** (with *trigger-word* coaching: "start with *Use when…* and name the
     task so Cowork knows when to load it"; live validate),
   - **instructions** (prefilled with a sensible default the learner can edit; it must
     reference `voice.md`).
   Live **SKILL.md preview** pane assembles as they type, with the validator panel (§8)
   showing ✓/⚠/✗ rows (frontmatter present, kebab name, description has a trigger,
   instructions reference voice.md, under 1 MB, library ≤ 50).
4. **Test bench** — the payoff. Layout: left = a **messy draft** (sample provided per
   scenario, editable); a **command input** styled like a slash command
   (e.g. `/skill polish this for my Monday update`) to "invoke" the skill — teaching that
   in real Cowork you'd just describe the task. **Run** → `POST /api/run-skill` with
   `{ skillMd, voiceMd, draft, instruction, scenarioId }`. Right = the **result** the LLM
   produced by applying their skill. Show a subtle "Cowork loaded *<skill-name>* (matched
   your description) → applied voice.md" trace line above the output to reinforce the
   discovery model. Let them **edit voice.md / SKILL.md inline and re-run** to see it
   improve. Show loading + error states; in MOCK mode, label the output "demo mode —
   configure a model key for live results."
5. **Finish** — recap of what they built + the four-building-blocks reminder + the
   governance note. **Download `SKILL.md`** and **Download `voice.md`** (individual Blob
   downloads). Show the real install path: drop both into
   `OneDrive/Documents/Cowork/skills/<name>/`. Offer "Start over" (clears state).

UX: clear step progress, Back/Next, never lose work on refresh, mobile-usable (stack
panes).

## 8. Pure functions (src/lib) — unit-tested with vitest

Keep these pure and dependency-free (except a tiny frontmatter parse). Export typed:

- `assembleSkillMd(input: SkillFields): string` — build the SKILL.md text:
  frontmatter (`name`, `description`) + body (instructions) + a reference to `voice.md`.
- `assembleVoiceMd(input: VoiceFields): string` — build the voice.md reference file from
  sample emails and/or a tone description.
- `parseFrontmatter(md: string): { name?: string; description?: string; body: string }`
  — minimal YAML-frontmatter reader (no external dep needed for two scalar fields).
- `validateSkill(args: { skillMd: string; voiceMd: string; librarySize?: number }):
  Finding[]` where `Finding = { level: 'ok'|'warn'|'error'; field: string; message: string }`.
  Rules: name present & kebab-case; description present, ≥ ~8 words and contains a trigger
  cue (e.g. "use when"/"when"); body non-empty & references voice.md; total size < 1 MB;
  librarySize (default 1) ≤ 50.
- `buildRunPrompt(args: { skillMd: string; voiceMd: string; draft: string; instruction:
  string }): { system: string; user: string }` — constructs the prompt that **simulates
  Cowork loading and applying the skill**: system = "You are Microsoft 365 Copilot Cowork.
  The user has this skill installed: <SKILL.md>. It references this voice.md: <voice.md>.
  Apply the skill faithfully to the user's request. Output only the finished email." user
  = the draft + the slash instruction. Keep it robust to empty fields.

Provide a `mockRun(args)` deterministic transform for MOCK mode (e.g. trims, applies a
greeting/sign-off, light cleanup) so the test bench always returns *something* shaped
like an email.

## 9. API route contract — `POST /api/run-skill`

- **Runtime:** Node (default) is fine. Export `export const maxDuration = 30`.
- **Request body** (validate; reject oversize): `{ skillMd: string; voiceMd: string;
  draft: string; instruction: string; scenarioId?: string }`. Cap each string (e.g.
  skillMd/voiceMd ≤ 8 KB, draft ≤ 8 KB, instruction ≤ 1 KB). Reject with 400 on
  validation failure.
- **Rate limit:** best-effort in-memory token bucket keyed by client IP
  (`x-forwarded-for`), e.g. ~10 requests / 5 min. On exceed → 429 with a friendly
  message. (Note in code: durable limiting needs a KV store — out of scope for v1.)
- **Provider selection (server-only env):**
  - `ANTHROPIC_API_KEY` set → `@ai-sdk/anthropic`, model `process.env.WORKSHOP_MODEL ||
    'claude-sonnet-4-6'`.
  - else `GOOGLE_GENERATIVE_AI_API_KEY` set → `@ai-sdk/google`, model
    `process.env.WORKSHOP_MODEL || 'gemini-2.5-flash'`.
  - else → **MOCK mode**: return `mockRun(...)` output with `mode: 'mock'`.
- Build the prompt with `buildRunPrompt(...)`, call AI SDK `generateText` with a sensible
  `maxOutputTokens` (~700) and low temperature. Verify the current `generateText` /
  provider-construction API via context7 before writing.
- **Response:** `{ ok: true, output: string, mode: 'live'|'mock', model?: string }` or
  `{ ok: false, error: string }` with an appropriate status. Never leak the key or stack
  traces. Never log user content.
- **Security:** API key is server-only (never `NEXT_PUBLIC_`). The skill/voice/draft are
  user-supplied free text fed to the model; since the model has no tools and the output
  returns only to the same user, prompt-injection blast radius is contained — but the
  system prompt should still scope the model to "produce the finished email only." Add a
  one-line comment noting this.

## 10. Design system & UI kit

Aesthetic: a **polished, modern "AI workbench."** Confident, clean, a little technical —
credible for enterprise clients, not childish, not generic-AI-purple. Light base with one
strong accent and dark code/preview panes. Strong typography hierarchy. Generous
whitespace. Fully responsive; keyboard-accessible; respects `prefers-reduced-motion`.

The **foundation step** establishes (so feature agents stay consistent):
- `src/app/globals.css` — Tailwind v4 `@theme` tokens: color scale (one accent, neutral
  ramp, semantic ok/warn/error), font tokens (sans = Geist/Inter via `next/font`; mono =
  Geist Mono), radius, shadow. A few base component classes if helpful.
- A small **UI kit** in `src/components/ui/`: `Button`, `Card`, `Callout`
  (info/warn/success), `CodePane` (mono, dark, with a filename tab + copy button),
  `Stepper`, `ValidatorRow` (✓/⚠/✗ + message), `Field` (label + input/textarea + hint),
  `Badge`. Typed props, documented at top of each file. Feature agents MUST reuse these,
  not reinvent.

Feature agents import from `@/components/ui/*` and follow the token classes. Do not add
new color literals — use tokens.

## 11. Scenario data shape (`src/lib/scenarios.ts`)

```ts
export type Scenario = {
  id: string;
  title: string;            // "Email in my voice"
  blurb: string;            // one line shown on the goal step
  defaultSkillName: string; // "email-in-my-voice"
  defaultDescription: string;
  defaultInstructions: string; // references voice.md
  voicePrompts: { sampleLabel: string; toneLabel: string };
  sampleDraft: string;      // the messy draft handed to the learner in the test bench
  sampleCommand: string;    // prefilled slash command e.g. "/skill polish for my team"
};
```

Ship `email-in-my-voice` fully. Add one secondary scenario (e.g. `meeting-notes-to-actions`
— turn messy notes into a crisp action list) reusing the same flow, to show the pattern
generalizes. The builder defaults its fields from the chosen scenario but everything stays
editable.

## 12. Finish / download

Individual Blob downloads for `SKILL.md` and `voice.md` (filenames from the skill name).
No zip dependency. Show the OneDrive install path. "Start over" clears `localStorage`.

## 13. Accuracy & safety guardrails

- Every Cowork claim must trace to §4. If unsure, omit. Footer carries the **preview
  disclaimer** + the two source links.
- No invented stats, no fake Microsoft quotes beyond the verbatim one in §4.
- The API route must not store or log user content; key stays server-side; MOCK fallback
  keeps the public site functional and free when no key is set.

## 14. File map (target)

```
src/
  app/
    layout.tsx            # fonts, nav, footer, metadata
    globals.css           # Tailwind v4 @theme tokens
    page.tsx              # landing
    learn/page.tsx        # Module 1
    build/page.tsx        # Module 2 lab (client component; localStorage)
    api/run-skill/route.ts
  components/
    ui/                   # Button, Card, Callout, CodePane, Stepper, ValidatorRow, Field, Badge
    learn/                # Learn sections (LearnNav, BuildingBlocks, AnatomyCard, etc.)
    build/                # Lab pieces (VoiceStep, SkillStep, TestBench, FinishStep, ValidatorPanel)
    site/                 # Nav, Footer
  lib/
    skill.ts              # assembleSkillMd, assembleVoiceMd, parseFrontmatter, validateSkill, buildRunPrompt, mockRun
    scenarios.ts
    storage.ts            # typed localStorage load/save of workshopState
    types.ts
  lib/__tests__/skill.test.ts  # vitest
docs/BUILD_BRIEF.md
.env.example
README.md
```

## 15. Acceptance criteria

- `pnpm build` passes (TypeScript clean) and `pnpm lint` is clean.
- `pnpm test` (vitest) green for the pure functions.
- `/`, `/learn`, `/build` all render; the lab persists across refresh.
- The test bench works in MOCK mode with no key, and in live mode with a key.
- All Cowork facts trace to §4; footer has the disclaimer + sources.
- Looks polished and consistent (shared UI kit), responsive, accessible.
- `.env.example` + README document the one env var and Vercel deploy in a few steps.
