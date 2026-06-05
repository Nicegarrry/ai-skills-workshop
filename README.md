# AI Skills Workshop

An interactive training site that teaches business users to build a **Microsoft 365 Copilot Cowork custom skill**, then lets them test and refine it against a real LLM — all in the browser, no login required.

> Cowork is currently in preview, gated behind the Microsoft Frontier program. All Cowork facts on this site trace to Microsoft's official documentation. Verify against current Microsoft docs before acting on anything.

---

## What it is

Two focused modules:

**Module 1 — Learn** (`/learn`)\
Just enough theory: what Cowork is, why a reusable skill beats a one-off prompt, the four building blocks (Custom Skill / Saved Prompt / Plugin / Scheduled Task), and the anatomy of a `SKILL.md` file. ~5 minutes, scrollable.

**Module 2 — Build** (`/build`)\
The lab. You capture your writing voice, author a two-file skill (`SKILL.md` + `voice.md`) for the scenario "write an email in my voice," then drop into a virtual test bench: paste a messy draft, invoke your skill, and a real LLM applies it. Edit, re-run, watch it improve. Finish by downloading both files and the install instructions for OneDrive.

Workshop state (your skill draft, voice inputs, current step) persists in `localStorage` so you can refresh and resume.

---

## Local development

```bash
pnpm install
pnpm dev        # starts on http://localhost:3000
```

The app runs in **MOCK mode** by default (no API key needed — see below). Copy `.env.example` to `.env.local` and add a key to enable live LLM calls:

```bash
cp .env.example .env.local
# then edit .env.local
```

---

## LLM provider selection and MOCK mode

The only server surface is `POST /api/run-skill`. Provider is chosen at request time from server-only environment variables — the API key is never exposed to the browser.

| Env var set | Provider used | Default model |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic | `claude-sonnet-4-6` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Generative AI | `gemini-3.5-flash` |
| Neither | **MOCK mode** | — |

If both keys are set, Anthropic takes precedence.

**MOCK mode** returns a deterministic local transform (trim, light cleanup, greeting/sign-off) — no LLM call, no API key, no cost. The test bench labels the output "demo mode — configure a model key for live results." The rest of the site is fully functional in MOCK mode.

**Override the model** (must be a valid ID for whichever provider key is active):

```
WORKSHOP_MODEL=claude-sonnet-4-6
```

See `.env.example` for the full variable reference.

---

## Deploy to Vercel

1. Push this repo to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, and click **Deploy** — no build config changes needed.
3. In the Vercel project dashboard, go to **Settings → Environment Variables** and add one key:
   - `ANTHROPIC_API_KEY` (recommended) **or** `GOOGLE_GENERATIVE_AI_API_KEY`
4. Trigger a redeploy (or the next push will pick it up). The site works in MOCK mode without any key.

That's it. No database, no auth, no additional services required.

---

## Sources

- Microsoft Learn — Copilot Cowork FAQ: https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-faq
- Microsoft 365 Blog (5 May 2026): https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/copilot-cowork-from-conversation-to-action-across-skills-integrations-and-devices/
