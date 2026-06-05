/**
 * Button — the kit's single button primitive (+ ButtonLink for anchors).
 *
 * Props (Button):
 *  - variant?: "primary" | "secondary" | "ghost" | "danger"  (default "primary")
 *  - size?: "sm" | "md" | "lg"                                (default "md")
 *  - fullWidth?: boolean
 *  - ...all native <button> attributes (type, onClick, disabled, etc.)
 *
 * <ButtonLink> takes the same variant/size/fullWidth and native <a> attributes
 * (use it for navigation CTAs; wrap a Next <Link> by passing its props through,
 * or pass `href` directly).
 *
 * Token-driven only (accent / neutral / error tokens) — no color literals.
 * Reuse this everywhere; do not hand-roll buttons.
 */
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-medium " +
  "whitespace-nowrap transition-colors duration-150 select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-600 text-white shadow-card hover:bg-accent-700 active:bg-accent-800",
  secondary:
    "bg-surface text-fg border border-line-strong hover:bg-surface-2 active:bg-neutral-200",
  ghost: "bg-transparent text-fg hover:bg-surface-2 active:bg-neutral-200",
  danger:
    "bg-error-600 text-white shadow-card hover:bg-error-700 active:bg-error-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/** Shared class builder so <ButtonLink> renders identically to <Button>. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  fullWidth?: boolean,
  className?: string,
): string {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", fullWidth, className, type, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={buttonClasses(variant, size, fullWidth, className)}
        {...rest}
      />
    );
  },
);

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { variant = "primary", size = "md", fullWidth, className, ...rest },
    ref,
  ) {
    return (
      <a
        ref={ref}
        className={buttonClasses(variant, size, fullWidth, className)}
        {...rest}
      />
    );
  },
);
