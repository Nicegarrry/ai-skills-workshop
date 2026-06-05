/**
 * Landing page — route: /
 *
 * Full-bleed sections with inner max-w-7xl containers.
 * Register A — SapphireOS editorial style:
 *   mono .eyebrow / font-serif headline with .mark highlight /
 *   warm-paper bg / white cards with card-lift / sapphire accent.
 *
 * Hero includes an animated Cowork preview panel (Register B) showing
 * a brief faux exchange — gives visitors a glimpse of what they will build.
 *
 * Server component — no client interactivity needed on this page.
 */

import {
  AcademicCapIcon,
  BeakerIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  CoworkFrame,
  CoworkMessage,
  CoworkWorking,
  Sparkle,
} from "@/components/cowork";
import { cn } from "@/lib/cn";

// ─── Outcome item ─────────────────────────────────────────────────────────────

function Outcome({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-accent-50 text-accent-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-fg">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </li>
  );
}

// ─── Module card ──────────────────────────────────────────────────────────────

function ModuleCard({
  step,
  label,
  title,
  description,
  href,
  cta,
  accent = false,
}: {
  step: string;
  label: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent?: boolean;
}) {
  return (
    <Card
      interactive
      className={cn(
        "card-lift flex flex-col gap-5",
        accent && "ring-2 ring-accent-500/30",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            accent
              ? "bg-accent-600 text-white"
              : "bg-surface-2 text-neutral-500",
          )}
          aria-hidden="true"
        >
          {step}
        </span>
        <Badge tone={accent ? "accent" : "neutral"}>{label}</Badge>
      </div>
      <div>
        <h3 className="text-base font-semibold text-fg mb-1.5">{title}</h3>
        <CardBody>{description}</CardBody>
      </div>
      <div className="mt-auto pt-1">
        <a
          href={href}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium",
            "transition-colors duration-150",
            accent
              ? "text-accent-600 hover:text-accent-700"
              : "text-muted hover:text-fg",
          )}
        >
          {cta}
          <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </Card>
  );
}

// ─── Cowork preview panel (faux exchange shown in hero) ───────────────────────
// Purely decorative / illustrative — no interactive state.
// Claims are strictly from §4 of BUILD_BRIEF.md.

function CoworkPreview() {
  return (
    <CoworkFrame
      subtitle="Cowork"
      avatarInitials="YO"
      showRail={false}
      className="w-full max-w-md text-sm"
      bodyClassName="py-4"
    >
      <CoworkMessage role="user">
        /skill polish my Monday update for the team
      </CoworkMessage>

      <CoworkWorking
        steps={[
          "Loaded email-in-my-voice skill",
          "Reading voice.md reference",
          "Rewriting in your voice",
        ]}
        activeIndex={3}
        label="Done — here's your email"
        skeletonLines={0}
      />

      <CoworkMessage role="assistant">
        <span className="block font-semibold mb-1 text-cw-text">
          Subject: Monday update — quick wins &amp; one decision needed
        </span>
        <span className="block text-cw-muted leading-relaxed">
          Hey team, three things to flag before standup: the integration shipped
          to staging, the Q3 brief is ready for your review, and I need a
          decision on the timeline by EOD. Quick wins, one blocker. Let’s talk
          at 10.
        </span>
        <span className="block mt-2 text-xs text-cw-muted">
          Cowork loaded{" "}
          <span className="font-semibold text-cw-brand">email-in-my-voice</span>{" "}
          (matched your description) → applied voice.md
        </span>
      </CoworkMessage>
    </CoworkFrame>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero — full bleed, warm paper + sapphire wash ─────────────────── */}
      <section className="relative overflow-hidden bg-bg">
        {/* Gradient wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-100/70 via-transparent to-amber-50/40"
        />
        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#16386B 0,#16386B 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#16386B 0,#16386B 1px,transparent 1px,transparent 60px)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-24 lg:py-28 lg:px-8">
          <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-12 xl:gap-20">
            {/* Left: editorial copy */}
            <div className="flex-1 min-w-0 animate-fade-up">
              {/* Eyebrow */}
              <p className="eyebrow mb-5">AI Skills Workshop</p>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl tracking-tight text-fg leading-[1.1]">
                Build a real{" "}
                <span className="mark">Cowork skill</span>.{" "}
                <br className="hidden sm:block" />
                Watch it run.
              </h1>

              {/* Sub-headline */}
              <p className="mt-6 text-lg leading-relaxed text-muted max-w-prose">
                In about 10 minutes you will author a{" "}
                <code className="rounded-md bg-surface px-1.5 py-0.5 text-sm font-mono text-fg border border-line">
                  SKILL.md
                </code>{" "}
                and a{" "}
                <code className="rounded-md bg-surface px-1.5 py-0.5 text-sm font-mono text-fg border border-line">
                  voice.md
                </code>{" "}
                for Microsoft 365 Copilot Cowork, then invoke your skill against
                a real LLM and watch it rewrite a messy draft in your own voice.
              </p>

              {/* Badges */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="accent">Microsoft 365 Copilot Cowork</Badge>
                <Badge tone="warn">Preview</Badge>
                <Badge tone="neutral">~10 min</Badge>
              </div>

              {/* CTA row */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/learn" size="lg">
                  Start learning
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/build" variant="secondary" size="lg">
                  Jump to the lab
                </ButtonLink>
              </div>
            </div>

            {/* Right: Cowork preview panel */}
            <div className="w-full lg:w-auto lg:shrink-0 lg:max-w-[440px] xl:max-w-[480px] animate-rise">
              {/* Label above the panel */}
              <div className="mb-3 flex items-center gap-2">
                <Sparkle size={14} animated />
                <span className="eyebrow text-[10px]">What you&rsquo;ll build</span>
              </div>
              <CoworkPreview />
              <p className="mt-2.5 text-xs text-muted text-center">
                Illustrative preview — your output will reflect your actual skill
                and voice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you'll walk away with ─────────────────────────────────────── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-20 lg:px-8">
          {/* Section header */}
          <p className="eyebrow mb-3">Outcomes</p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-fg mb-2">
            What you&rsquo;ll{" "}
            <span className="mark-amber">walk away with</span>
          </h2>
          <p className="text-muted max-w-prose mb-8 sm:mb-12">
            Three concrete outcomes — not theory slides, not a certificate.
          </p>

          <ul className="grid gap-6 sm:gap-8 sm:grid-cols-3">
            <Outcome
              icon={AcademicCapIcon}
              title="A clear mental model"
              body="Understand the difference between a skill, a saved prompt, a plugin, and a scheduled task — and when to reach for each one."
            />
            <Outcome
              icon={BeakerIcon}
              title="A skill you tested live"
              body="A two-file skill (SKILL.md + voice.md) you authored and ran against a real LLM in the browser — not a toy example."
            />
            <Outcome
              icon={ArrowDownTrayIcon}
              title="Files ready to install"
              body="Download your skill files and drop them straight into OneDrive. No admin approval, no coding — just drag and drop."
            />
          </ul>
        </div>
      </section>

      {/* ── How it works — two-module strip ──────────────────────────────────── */}
      <section className="border-t border-line bg-bg">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-20 lg:px-8">
          <p className="eyebrow mb-3">Two modules</p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-fg mb-2">
            How it works
          </h2>
          <p className="text-muted max-w-prose mb-8 sm:mb-12">
            Learn just enough, then do. No fluff, no walls of text.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <ModuleCard
              step="1"
              label="5 min read"
              title="Learn — just enough theory"
              description="What Cowork actually is (and how it differs from Copilot Chat), why a reusable skill beats a one-off prompt, the four building blocks, and the anatomy of a SKILL.md. Scannable, no fluff."
              href="/learn"
              cta="Read the overview"
            />
            <ModuleCard
              step="2"
              label="The lab"
              title="Build — the interactive lab"
              description="Author your voice.md, write your SKILL.md with a live preview and validator, then test your skill in a virtual bench — real LLM, real output. Edit and re-run until it sounds right. Download when done."
              href="/build"
              cta="Open the lab"
              accent
            />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA strip ──────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl text-fg tracking-tight">
              Ready? It takes about 10 minutes.
            </p>
            <p className="text-sm text-muted mt-1">
              No account, no install, no prior coding experience required.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <ButtonLink href="/learn">
              Start with the overview
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/build" variant="secondary">
              Skip ahead to the lab
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Portable-format note ──────────────────────────────────────────────── */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex items-start gap-3">
            <CheckCircleIcon
              className="mt-0.5 h-4 w-4 shrink-0 text-ok-600"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-muted">
              <span className="font-semibold text-fg">Portable skill format.</span>{" "}
              The{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs font-mono border border-line">
                SKILL.md
              </code>{" "}
              format (Markdown body + YAML frontmatter with{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs font-mono border border-line">
                name
              </code>{" "}
              and{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs font-mono border border-line">
                description
              </code>
              ) is an emerging open convention shared across Microsoft Cowork,
              GitHub Copilot, and Anthropic Claude. Skills you write here
              transfer across tools.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
