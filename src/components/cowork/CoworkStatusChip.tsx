/**
 * CoworkStatusChip — a Fluent-style status pill for the Cowork mock surface.
 *
 * A compact `rounded-pill` (12px text) chip that reads at a glance: the agentic
 * coworker's task can be in-progress, awaiting the user, done, or failed.
 *
 * Props:
 *  - variant: "in-progress" | "needs" | "done" | "failed"
 *  - label?: string        — override the default per-variant label
 *  - className?: string
 *  - ...native <span> attributes.
 *
 * Register B (Cowork) tokens only. Heroicons 24px outline. Reduced-motion-safe
 * (the in-progress pulse is a global `animate-*` utility).
 */
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type CoworkStatusVariant = "in-progress" | "needs" | "done" | "failed";

type VariantConfig = {
  label: string;
  classes: string;
  dotClasses?: string;
  Icon?: typeof CheckCircleIcon;
};

const VARIANTS: Record<CoworkStatusVariant, VariantConfig> = {
  "in-progress": {
    label: "Working",
    classes: "bg-cw-brand-tint text-cw-brand",
    dotClasses: "bg-cw-brand",
  },
  needs: {
    label: "Needs you",
    classes: "bg-cw-warn-tint text-cw-warn",
    Icon: ExclamationTriangleIcon,
  },
  done: {
    label: "Done",
    classes: "bg-cw-ok-tint text-cw-ok",
    Icon: CheckCircleIcon,
  },
  failed: {
    label: "Failed",
    classes: "bg-cw-err-tint text-cw-err",
    Icon: ExclamationTriangleIcon,
  },
};

export type CoworkStatusChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant: CoworkStatusVariant;
  label?: string;
};

export function CoworkStatusChip({
  variant,
  label,
  className,
  ...rest
}: CoworkStatusChipProps) {
  const config = VARIANTS[variant];
  const { Icon } = config;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1",
        "font-fluent text-xs font-medium leading-none",
        config.classes,
        className,
      )}
      {...rest}
    >
      {variant === "in-progress" ? (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cw-brand opacity-60" />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              config.dotClasses,
            )}
          />
        </span>
      ) : Icon ? (
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      ) : null}
      {label ?? config.label}
    </span>
  );
}
