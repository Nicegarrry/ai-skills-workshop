"use client";

/**
 * Reveal — in-view animation primitive for deck screens.
 *
 * A DeckScreen publishes its in-view state via ScreenInViewContext; <Reveal>
 * applies its entrance animation (`animate-fade-up` or `animate-rise`) ONLY once
 * the containing screen is in view, so motion plays as the slide arrives rather
 * than on first paint (and is held at the start state until then). Stagger via
 * `delay` (ms). Reduced-motion is handled globally in globals.css.
 *
 * Usage inside a screen:
 *   <Reveal as="h2" className="font-serif text-5xl">Headline</Reveal>
 *   <Reveal delay={120}>…body…</Reveal>
 */
import {
  createContext,
  useContext,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/** Published by DeckScreen; true once the slide has been scrolled into view. */
export const ScreenInViewContext = createContext(false);

type RevealProps = {
  children: ReactNode;
  /** Element to render (default "div"). */
  as?: ElementType;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** "up" = fade-up (default), "rise" = the shorter rise. */
  variant?: "up" | "rise";
  className?: string;
  style?: CSSProperties;
};

export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "up",
  className,
  style,
}: RevealProps) {
  const inView = useContext(ScreenInViewContext);
  return (
    <Tag
      className={cn(
        // Held invisible until in view; then the entrance animation runs.
        inView
          ? variant === "rise"
            ? "animate-rise"
            : "animate-fade-up"
          : "opacity-0",
        className,
      )}
      style={{ animationDelay: inView ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
}
