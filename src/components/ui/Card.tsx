/**
 * Card — a surface container with the kit's border, radius, and shadow.
 *
 * Props:
 *  - as?: keyof JSX.IntrinsicElements equivalent ("div" | "section" | ...)  (default "div")
 *  - padded?: boolean  — apply standard inner padding (default true)
 *  - interactive?: boolean — add hover affordance (for clickable cards)
 *  - ...native attributes of the chosen element.
 *
 * Subparts CardHeader / CardTitle / CardBody let features compose without
 * re-deciding spacing. All token-driven.
 */
import type { HTMLAttributes, ElementType } from "react";
import { cn } from "@/lib/cn";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: ElementType;
  padded?: boolean;
  interactive?: boolean;
};

export function Card({
  as: Tag = "div",
  padded = true,
  interactive = false,
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-line bg-surface shadow-card",
        padded && "p-5 sm:p-6",
        interactive &&
          "transition-shadow duration-150 hover:shadow-pop focus-within:shadow-pop",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3 flex flex-col gap-1", className)} {...rest} />;
}

export function CardTitle({
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold text-fg", className)}
      {...rest}
    />
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm leading-relaxed text-muted", className)} {...rest} />
  );
}
