/**
 * Footer — Register A (SapphireOS light). Client Component.
 *
 * Uses usePathname() to return null on /learn — the learn route is a
 * full-viewport scroll-snap deck that must own the full viewport height.
 * The footer would push content out of the snap model on that route.
 *
 * Contains (per BUILD_BRIEF §4 / §13):
 *  1. Preview disclaimer — Cowork is in preview/Frontier-gated.
 *  2. Source links — the two canonical Microsoft sources from §4.
 *  3. Brief workshop attribution.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // The /learn route is a full-viewport scroll-snap deck — no footer.
  if (pathname === "/learn" || pathname.startsWith("/learn/")) return null;

  return (
    <footer className="mt-auto border-t border-line bg-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

          {/* Disclaimer */}
          <div className="max-w-prose">
            <p className="eyebrow mb-2">Preview notice</p>
            <p className="text-xs leading-relaxed text-muted">
              Microsoft 365 Copilot Cowork is in preview and gated behind the
              Frontier program as of June 2026. Features, limits, and
              availability may change.{" "}
              <strong className="font-semibold text-fg">
                Verify all claims against current Microsoft documentation
              </strong>{" "}
              before relying on them.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Custom skills created by users are not validated by Microsoft.
              Review custom skill outputs carefully.
            </p>
          </div>

          {/* Sources */}
          <div className="shrink-0">
            <p className="eyebrow mb-2">Sources</p>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-xs text-muted underline underline-offset-2 decoration-line",
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
        <div
          className={cn(
            "mt-6 pt-4 border-t border-line",
            "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between",
            "text-xs text-muted",
          )}
        >
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
