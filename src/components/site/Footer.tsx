/**
 * Footer — shared across the workshop.
 *
 * Contains (per BUILD_BRIEF §13 / §4):
 *  1. Preview disclaimer — Cowork is in preview/Frontier-gated; verify against
 *     current Microsoft docs before relying on any facts stated here.
 *  2. Source links — the two canonical Microsoft sources cited in §4.
 *  3. Brief workshop attribution.
 *
 * Server component; no client logic required.
 */

import Link from "next/link";
import { cn } from "@/lib/cn";

/** The two verified Microsoft sources from BUILD_BRIEF §4. */
const SOURCES = [
  {
    label: "Copilot Cowork FAQ — Microsoft Learn",
    href: "https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-faq",
  },
  {
    label: "Microsoft 365 Blog — Copilot Cowork announcement (5 May 2026)",
    href: "https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/copilot-cowork-from-conversation-to-action-across-skills-integrations-and-devices/",
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface-2">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* Disclaimer */}
          <div className="max-w-prose text-xs leading-relaxed text-muted">
            <p className="font-semibold text-fg mb-1">Preview notice</p>
            <p>
              Microsoft 365 Copilot Cowork is in preview and gated behind the
              Frontier program as of June 2026. Features, limits, and
              availability may change.{" "}
              <strong className="font-medium text-fg">
                Verify all claims against current Microsoft documentation
              </strong>{" "}
              before relying on them.
            </p>
            <p className="mt-2">
              Custom skills created by users are not validated by Microsoft.
              Review custom skill outputs carefully.
            </p>
          </div>

          {/* Sources */}
          <div className="shrink-0 text-xs text-muted">
            <p className="font-semibold text-fg mb-2">Sources</p>
            <ul className="flex flex-col gap-1.5 list-none m-0 p-0">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "underline underline-offset-2 decoration-line",
                      "hover:text-accent-600 hover:decoration-accent-400",
                      "transition-colors duration-150",
                    )}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-6 pt-4 border-t border-line flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs text-muted">
          <p>AI Skills Workshop — an interactive learning experience.</p>
          <p>
            Built with{" "}
            <Link
              href="/learn"
              className="underline underline-offset-2 hover:text-fg transition-colors duration-150"
            >
              Next.js + Vercel AI SDK
            </Link>
            . No data is stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
