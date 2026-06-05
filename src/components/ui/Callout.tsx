/**
 * Callout — an inline message block (info / warn / success).
 *
 * Props:
 *  - tone?: "info" | "warn" | "success"  (default "info")
 *  - title?: ReactNode   — optional bold lead line
 *  - icon?: boolean       — show the tone icon (default true)
 *  - children: ReactNode  — body content
 *  - ...native <div> attributes.
 *
 * Used for the preview disclaimer, governance note, MOCK-mode label, etc.
 * Token-driven; the heroicon is chosen by tone.
 */
import type { HTMLAttributes, ReactNode } from "react";
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

export type CalloutTone = "info" | "warn" | "success";

export type CalloutProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CalloutTone;
  title?: ReactNode;
  icon?: boolean;
};

const tones: Record<
  CalloutTone,
  { wrap: string; icon: string; Icon: typeof InformationCircleIcon }
> = {
  info: {
    wrap: "bg-accent-50 border-accent-200 text-accent-900",
    icon: "text-accent-600",
    Icon: InformationCircleIcon,
  },
  warn: {
    wrap: "bg-warn-50 border-warn-500/30 text-warn-700",
    icon: "text-warn-600",
    Icon: ExclamationTriangleIcon,
  },
  success: {
    wrap: "bg-ok-50 border-ok-500/30 text-ok-700",
    icon: "text-ok-600",
    Icon: CheckCircleIcon,
  },
};

export function Callout({
  tone = "info",
  title,
  icon = true,
  className,
  children,
  ...rest
}: CalloutProps) {
  const { wrap, icon: iconColor, Icon } = tones[tone];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-control border p-4 text-sm leading-relaxed",
        wrap,
        className,
      )}
      {...rest}
    >
      {icon && (
        <Icon
          aria-hidden="true"
          className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)}
        />
      )}
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-1")}>{children}</div>}
      </div>
    </div>
  );
}
