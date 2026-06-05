/**
 * Landing page — route: /
 *
 * One confident screen:
 *  1. Hero — the promise: "build a real Microsoft 365 Copilot Cowork skill
 *     in ~10 minutes and watch it run."
 *  2. What they'll do — three concrete outcomes.
 *  3. How it works — two-module strip (Learn → Build).
 *  4. Primary CTA → /learn; secondary CTA → /build (skip ahead).
 *
 * Server component — no interactivity needed.
 * Reuses UI kit: ButtonLink, Card, CardHeader, CardTitle, CardBody, Badge.
 */

import Link from "next/link";
import {
  AcademicCapIcon,
  BeakerIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { ButtonLink, Card, CardBody, Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

// ─── Outcome item ────────────────────────────────────────────────────────────

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
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-fg">{title}</p>
        <p className="text-sm text-muted leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

// ─── Module card ─────────────────────────────────────────────────────────────

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
      className={cn(
        "flex flex-col gap-4",
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
        <h3 className="text-base font-semibold text-fg mb-1">{title}</h3>
        <CardBody>{description}</CardBody>
      </div>
      <div className="mt-auto pt-2">
        <Link
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
        </Link>
      </div>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface">
        {/* Subtle accent gradient wash behind the hero text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-50/60 via-transparent to-transparent"
        />

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-5 flex items-center gap-2.5">
              <Badge tone="accent">Microsoft 365 Copilot Cowork</Badge>
              <Badge tone="warn">Preview</Badge>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-5xl leading-tight">
              Build a real Cowork skill.{" "}
              <span className="text-accent-600">Watch it run.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-lg leading-relaxed text-muted max-w-xl">
              In about 10 minutes you will author a{" "}
              <code className="rounded-md bg-surface-2 px-1.5 py-0.5 text-sm font-mono text-fg">
                SKILL.md
              </code>{" "}
              and a{" "}
              <code className="rounded-md bg-surface-2 px-1.5 py-0.5 text-sm font-mono text-fg">
                voice.md
              </code>{" "}
              file, then invoke your skill against a live LLM and see it
              rewrite a messy draft in your own voice.
            </p>

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
        </div>
      </section>

      {/* ── What you'll walk away with ──────────────────────────────── */}
      <section className="border-t border-line bg-bg">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-xl font-semibold text-fg mb-2">
            What you&rsquo;ll walk away with
          </h2>
          <p className="text-sm text-muted mb-8 max-w-prose">
            Three concrete outcomes — not theory slides, not a certificate.
          </p>

          <ul className="flex flex-col gap-5 sm:grid sm:grid-cols-3">
            <Outcome
              icon={AcademicCapIcon}
              title="A clear mental model"
              body="Understand the difference between a skill, a saved prompt, a plugin, and a scheduled task — and when to reach for each."
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

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-xl font-semibold text-fg mb-2">How it works</h2>
          <p className="text-sm text-muted mb-8 max-w-prose">
            Two focused modules. Learn just enough, then do.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
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

      {/* ── Bottom CTA strip ───────────────────────────────────────── */}
      <section className="border-t border-line bg-bg">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-base font-semibold text-fg">
              Ready? It takes about 10 minutes.
            </p>
            <p className="text-sm text-muted mt-0.5">
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

      {/* ── Portable-format note ────────────────────────────────────── */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex items-start gap-3">
            <CheckCircleIcon
              className="mt-0.5 h-4 w-4 shrink-0 text-ok-600"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-muted">
              <span className="font-medium text-fg">Portable skill format.</span>{" "}
              The{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs font-mono">
                SKILL.md
              </code>{" "}
              format (Markdown body + YAML frontmatter with{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs font-mono">
                name
              </code>{" "}
              and{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs font-mono">
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
