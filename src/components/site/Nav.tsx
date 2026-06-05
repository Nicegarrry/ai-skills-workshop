/**
 * Nav — top navigation bar shared across the whole workshop.
 *
 * Renders:
 *  - Workshop name (links to /)
 *  - Two primary nav links: Learn (/learn) and Build (/build)
 *  - An optional progress indicator: a pair of small dots that fill
 *    when the visitor has advanced past the landing. Driven by the
 *    `data-nav-step` attribute — not required for correctness; the nav
 *    works without JS.
 *
 * Server component (no 'use client') — uses Next <Link> for prefetch.
 * Active-link highlighting is handled via CSS (current-page contrast).
 */

import Link from "next/link";
import { cn } from "@/lib/cn";

/** Internal link item used by the nav. */
function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-control px-3 py-1.5",
        "text-sm font-medium text-muted",
        "transition-colors duration-150",
        "hover:bg-surface-2 hover:text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Two small progress dots — one per module (Learn, Build).
 * Pure visual; no client logic needed for the shell. The /build page
 * can set body[data-build-started] to drive more granular state if desired.
 */
function ProgressDots() {
  return (
    <div
      className="hidden sm:flex items-center gap-1.5"
      aria-hidden="true"
      title="Workshop progress"
    >
      {/* Learn dot */}
      <span className="h-1.5 w-1.5 rounded-pill bg-neutral-300 dark:bg-neutral-600" />
      {/* Build dot */}
      <span className="h-1.5 w-1.5 rounded-pill bg-neutral-300 dark:bg-neutral-600" />
    </div>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 rounded-control px-1 py-1",
            "text-sm font-semibold text-fg tracking-tight",
            "transition-opacity duration-150 hover:opacity-75",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
          )}
        >
          {/* Small accent square icon */}
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-600 text-white text-xs font-bold select-none"
            aria-hidden="true"
          >
            S
          </span>
          <span className="hidden sm:inline">Skills Workshop</span>
          <span className="sm:hidden">Workshop</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Progress dots */}
        <ProgressDots />

        {/* Nav links */}
        <nav aria-label="Workshop navigation">
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            <li>
              <NavLink href="/learn">Learn</NavLink>
            </li>
            <li>
              <NavLink
                href="/build"
                className="text-accent-600 hover:text-accent-700 hover:bg-accent-50"
              >
                Build
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
