/**
 * Nav — slim sticky top bar, Register A (SapphireOS light).
 *
 * Shell is a Server Component for prefetch. Active-link highlighting
 * needs usePathname(), so it lives in the thin <NavLinks> Client Component
 * — the only 'use client' surface here.
 *
 * Design language:
 *  - warm-paper/translucent backdrop (bg-bg/85 + backdrop-blur)
 *  - sapphire bottom border on scroll (always present, subtle)
 *  - wordmark: serif "AI Skills Workshop" — editorial, no logo/branding
 *  - nav links: muted text → fg on hover; active = sapphire pill bg + text
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/build", label: "Build" },
] as const;

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Workshop navigation">
      <ul className="flex items-center gap-0.5 list-none m-0 p-0">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-control px-3 py-1.5",
                  "text-sm font-medium transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
                  active
                    ? "bg-accent-100 text-accent-600 font-semibold"
                    : "text-muted hover:bg-surface-2 hover:text-fg",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Nav() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "border-b border-line",
        // warm-paper translucent: bg-bg at 88% + blur
        "bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)]",
        "backdrop-blur-md",
        "supports-[backdrop-filter:blur(0)]:bg-bg/95",
      )}
    >
      <div className="mx-auto flex h-12 max-w-5xl items-center gap-4 px-4 sm:px-6">

        {/* Wordmark — serif editorial, no logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 rounded-control px-1 py-1",
            "transition-opacity duration-150 hover:opacity-75",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
          )}
        >
          {/* Qubit mark (logo only — the name is never used) */}
          <svg
            viewBox="0 0 64 64"
            className="h-5 w-5 shrink-0 text-accent-600"
            fill="none"
            aria-hidden="true"
          >
            <g stroke="currentColor" strokeWidth="3.2">
              <rect x="8" y="8" width="22" height="22" />
              <rect x="34" y="8" width="22" height="22" />
              <rect x="8" y="34" width="22" height="22" />
              <rect x="34" y="34" width="22" height="22" fill="currentColor" stroke="none" />
            </g>
          </svg>
          <span
            className={cn(
              "font-serif text-base tracking-tight text-fg",
              "hidden sm:inline",
            )}
          >
            AI Skills Workshop
          </span>
          <span
            className={cn(
              "font-serif text-base tracking-tight text-fg",
              "sm:hidden",
            )}
          >
            AI Skills
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav links — client for active state */}
        <NavLinks />
      </div>
    </header>
  );
}
