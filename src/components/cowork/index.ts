/**
 * Cowork mock-chrome kit barrel. Build agents import from "@/components/cowork".
 *
 * An evocative, NON-trademark Microsoft 365 Copilot Cowork window used as the
 * test-bench surface (register B — Fluent 2). These are the only Cowork-chrome
 * primitives — reuse them, do not reinvent. All are token-driven (the cw-*
 * tokens in src/app/globals.css) and use font-fluent; pass extra classes via
 * `className` (appended last, so they win by source order).
 */
export { Sparkle, type SparkleProps } from "./Sparkle";

export { CoworkFrame, type CoworkFrameProps } from "./CoworkFrame";

export {
  CoworkMessage,
  type CoworkMessageProps,
  type CoworkMessageRole,
} from "./CoworkMessage";

export { CoworkWorking, type CoworkWorkingProps } from "./CoworkWorking";

export {
  CoworkStatusChip,
  type CoworkStatusChipProps,
  type CoworkStatusVariant,
} from "./CoworkStatusChip";

export { CoworkComposer, type CoworkComposerProps } from "./CoworkComposer";
