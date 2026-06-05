/**
 * CoworkFrame — the window chrome for the Cowork mock surface (the test bench).
 *
 * An evocative, non-trademark stand-in for the Microsoft 365 Copilot Cowork
 * window: a rounded-xl (8px) white card on the Cowork canvas with a soft Fluent
 * pop shadow and a thin #E0E0E0 (cw-line) border. A slim Office-native header
 * carries the Sparkle + "Copilot" wordmark and a faint product subtitle on the
 * left, and a faux avatar circle on the right. An optional slim collapsed
 * left-rail strip of icon dots adds authenticity. Children render in a
 * chat-centered white canvas with comfortable padding; the optional `composer`
 * slot pins to the bottom.
 *
 * Props:
 *  - children: ReactNode      — the chat transcript / canvas content
 *  - composer?: ReactNode      — pinned to the bottom (e.g. <CoworkComposer />)
 *  - subtitle?: string         — faint product subtitle (default "Cowork")
 *  - avatarInitials?: string   — faux account avatar (default "AC")
 *  - showRail?: boolean        — render the collapsed left-rail strip (default true)
 *  - headerAside?: ReactNode   — extra header content left of the avatar (e.g. a status chip)
 *  - bodyClassName?: string    — escape hatch for the scroll canvas
 *  - className?: string        — escape hatch for the outer card
 *
 * Register B (Cowork) tokens + font-fluent only. Heroicons 24px outline.
 */
import {
  ClockIcon,
  HomeIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Sparkle } from "./Sparkle";

export type CoworkFrameProps = {
  children: ReactNode;
  composer?: ReactNode;
  subtitle?: string;
  avatarInitials?: string;
  showRail?: boolean;
  headerAside?: ReactNode;
  bodyClassName?: string;
  className?: string;
};

const RAIL_ICONS = [HomeIcon, Squares2X2Icon, ClockIcon];

export function CoworkFrame({
  children,
  composer,
  subtitle = "Cowork",
  avatarInitials = "AC",
  showRail = true,
  headerAside,
  bodyClassName,
  className,
}: CoworkFrameProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-cw-line",
        "bg-cw-surface font-fluent text-cw-text shadow-cw-pop",
        className,
      )}
    >
      {/* Office-native header */}
      <header className="flex items-center justify-between gap-3 border-b border-cw-line-soft bg-cw-surface px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkle size={18} />
          <span className="text-sm font-semibold tracking-tight text-cw-text">
            Copilot
          </span>
          {subtitle ? (
            <span className="truncate text-xs font-normal text-cw-muted">
              {subtitle}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {headerAside}
          <span
            className={cn(
              "grid h-7 w-7 shrink-0 place-items-center rounded-full",
              "bg-cw-brand text-[11px] font-semibold text-white",
            )}
            aria-hidden="true"
          >
            {avatarInitials.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </header>

      {/* Body: optional collapsed rail + chat canvas */}
      <div className="flex min-h-0 flex-1">
        {showRail ? (
          <nav
            className="hidden w-12 shrink-0 flex-col items-center gap-4 border-r border-cw-line-soft bg-cw-bg py-4 sm:flex"
            aria-hidden="true"
          >
            {RAIL_ICONS.map((Icon, i) => (
              <span
                key={i}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-control",
                  i === 0 ? "bg-cw-brand-tint text-cw-brand" : "text-cw-muted",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </nav>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col bg-cw-surface">
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6",
              bodyClassName,
            )}
          >
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
              {children}
            </div>
          </div>

          {composer ? (
            <div className="border-t border-cw-line-soft bg-cw-surface px-4 py-3 sm:px-6">
              <div className="mx-auto w-full max-w-2xl">{composer}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
