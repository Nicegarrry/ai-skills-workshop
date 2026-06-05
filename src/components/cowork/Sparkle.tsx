/**
 * Sparkle — the four-point Copilot-style sparkle mark (NOT the product logo).
 *
 * An evocative, non-trademark stand-in for the Microsoft 365 Copilot sparkle:
 * a four-point star with concave (pinched) sides, filled with the Copilot
 * gradient (135deg #199FD7 -> #8A50D8 -> #EE5091). An optional small secondary
 * sparkle sits at the upper-right for a touch of life. We deliberately do NOT
 * render the Mobius-ribbon hexagon brand logo.
 *
 * Props:
 *  - size?: number         — pixel width/height of the mark (default 18)
 *  - secondary?: boolean   — render the small accent sparkle (default true)
 *  - animated?: boolean    — add `animate-sparkle` (gentle pulse, reduced-motion-safe)
 *  - title?: string        — accessible label; when omitted the SVG is aria-hidden
 *  - className?: string
 *  - ...native <svg> attributes.
 *
 * Used as the leading glyph on the Copilot wordmark, assistant turns, and the
 * composer. Token / gradient driven — no color literals beyond the gradient stops.
 */
import { useId, type SVGProps } from "react";
import { cn } from "@/lib/cn";

export type SparkleProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  size?: number;
  secondary?: boolean;
  animated?: boolean;
  title?: string;
};

/** Concave-sided four-point star centered in a 0..24 box, scaled to taste. */
const MAIN_STAR =
  "M12 1.5 C12.9 6.7 13.0 8.6 14.6 9.9 C15.9 11.5 17.8 11.6 23 12.5 " +
  "C17.8 13.4 15.9 13.5 14.6 15.1 C13.0 16.4 12.9 18.3 12 23.5 " +
  "C11.1 18.3 11.0 16.4 9.4 15.1 C8.1 13.5 6.2 13.4 1 12.5 " +
  "C6.2 11.6 8.1 11.5 9.4 9.9 C11.0 8.6 11.1 6.7 12 1.5 Z";

const SECONDARY_STAR =
  "M19.5 2 C19.8 3.6 19.9 4.0 20.4 4.5 C20.9 5.0 21.3 5.1 22.9 5.4 " +
  "C21.3 5.7 20.9 5.8 20.4 6.3 C19.9 6.8 19.8 7.2 19.5 8.8 " +
  "C19.2 7.2 19.1 6.8 18.6 6.3 C18.1 5.8 17.7 5.7 16.1 5.4 " +
  "C17.7 5.1 18.1 5.0 18.6 4.5 C19.1 4.0 19.2 3.6 19.5 2 Z";

export function Sparkle({
  size = 18,
  secondary = true,
  animated = false,
  title,
  className,
  ...rest
}: SparkleProps) {
  const gradientId = useId();
  const labelled = Boolean(title);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      className={cn("shrink-0", animated && "animate-sparkle", className)}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#199FD7" />
          <stop offset="55%" stopColor="#8A50D8" />
          <stop offset="100%" stopColor="#EE5091" />
        </linearGradient>
      </defs>
      <path d={MAIN_STAR} fill={`url(#${gradientId})`} />
      {secondary ? (
        <path d={SECONDARY_STAR} fill={`url(#${gradientId})`} opacity={0.9} />
      ) : null}
    </svg>
  );
}
