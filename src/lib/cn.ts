import { clsx, type ClassValue } from "clsx";

/**
 * cn — merge conditional class names.
 *
 * Thin wrapper over `clsx`. We do NOT pull in tailwind-merge: the UI kit owns
 * its base classes and exposes a `className` escape hatch that is appended last,
 * so later utilities win by source order without needing conflict resolution.
 *
 * @example cn("px-3", isActive && "bg-accent-600", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
