/**
 * CoworkMessage — one conversation turn on the Cowork mock surface.
 *
 * role="user":      a lighter tinted block (bg-cw-user, 8px radius) aligned to
 *                   the right with a small initials avatar.
 * role="assistant": a full-width turn on white, led by a Sparkle + "Copilot"
 *                   label, then the children. The body wraps long text
 *                   (whitespace-pre-wrap, break-words) — prose NEVER horizontally
 *                   scrolls.
 *
 * Props:
 *  - role: "user" | "assistant"
 *  - children: ReactNode    — the turn content
 *  - name?: string          — assistant label override (default "Copilot")
 *  - initials?: string      — user avatar initials (default "You")
 *  - className?: string
 *
 * Register B (Cowork) tokens + font-fluent only.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Sparkle } from "./Sparkle";

export type CoworkMessageRole = "user" | "assistant";

export type CoworkMessageProps = {
  role: CoworkMessageRole;
  children: ReactNode;
  name?: string;
  initials?: string;
  className?: string;
};

export function CoworkMessage({
  role,
  children,
  name = "Copilot",
  initials = "You",
  className,
}: CoworkMessageProps) {
  if (role === "user") {
    return (
      <div className={cn("flex min-w-0 justify-end gap-2.5", className)}>
        <div
          className={cn(
            "min-w-0 max-w-[85%] rounded-lg bg-cw-user px-3.5 py-2.5",
            "font-fluent text-sm leading-relaxed text-cw-text",
            "whitespace-pre-wrap break-words",
          )}
        >
          {children}
        </div>
        <span
          className={cn(
            "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full",
            "bg-cw-brand-tint font-fluent text-[11px] font-semibold text-cw-brand",
          )}
          aria-hidden="true"
        >
          {initials.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <Sparkle size={16} secondary={false} />
        <span className="cw-grad-text font-fluent text-xs font-semibold">
          {name}
        </span>
      </div>
      <div
        className={cn(
          "min-w-0 pl-[22px] font-fluent text-sm leading-relaxed text-cw-text",
          "whitespace-pre-wrap break-words",
        )}
      >
        {children}
      </div>
    </div>
  );
}
