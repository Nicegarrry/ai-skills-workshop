/**
 * Badge — a small pill label for status / counts / tags.
 *
 * Props:
 *  - tone?: "neutral" | "accent" | "ok" | "warn" | "error"  (default "neutral")
 *  - ...native <span> attributes.
 *
 * Soft (tinted-background) styling; token-driven.
 */
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "accent" | "ok" | "warn" | "error";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-neutral-600 border-line",
  accent: "bg-accent-50 text-accent-700 border-accent-200",
  ok: "bg-ok-50 text-ok-700 border-ok-500/30",
  warn: "bg-warn-50 text-warn-700 border-warn-500/30",
  error: "bg-error-50 text-error-700 border-error-500/30",
};

export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill border px-2.5 py-0.5",
        "text-xs font-medium leading-5",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
