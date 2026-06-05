/**
 * ValidatorRow — one row of the skill validator panel.
 *
 * Props:
 *  - level: "ok" | "warn" | "error"   — drives the icon + color
 *  - field?: string                   — optional bold lead label (e.g. "name")
 *  - message: string                  — the explanation
 *  - className?: string
 *
 * Maps 1:1 to a `Finding` (see lib/types). Icons via @heroicons/react:
 *  ok = CheckCircle, warn = ExclamationTriangle, error = XCircle.
 */
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";
import type { FindingLevel } from "@/lib/types";

export type ValidatorRowProps = {
  level: FindingLevel;
  field?: string;
  message: string;
  className?: string;
};

const config: Record<
  FindingLevel,
  { Icon: typeof CheckCircleIcon; color: string; srLabel: string }
> = {
  ok: { Icon: CheckCircleIcon, color: "text-ok-600", srLabel: "Passed" },
  warn: {
    Icon: ExclamationTriangleIcon,
    color: "text-warn-600",
    srLabel: "Warning",
  },
  error: { Icon: XCircleIcon, color: "text-error-600", srLabel: "Error" },
};

export function ValidatorRow({
  level,
  field,
  message,
  className,
}: ValidatorRowProps) {
  const { Icon, color, srLabel } = config[level];
  return (
    <div className={cn("flex items-start gap-2.5 py-1.5 text-sm", className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", color)} aria-hidden="true" />
      <span className="sr-only">{srLabel}:</span>
      <p className="min-w-0 leading-snug text-fg">
        {field && <span className="font-semibold">{field}: </span>}
        <span className="text-muted">{message}</span>
      </p>
    </div>
  );
}
