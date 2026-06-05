/**
 * CoworkComposer — the Fluent-style message composer for the Cowork mock surface.
 *
 * A large rounded white box: a leading Sparkle, a controlled textarea that grows
 * with content, a decorative paperclip attach affordance, and a circular send
 * button that fills with the Cowork brand when there is text to send. The border
 * brightens to the brand color on focus with a soft focus ring.
 *
 * Keyboard: Enter submits; Shift+Enter inserts a newline. Submitting is a no-op
 * when the value is empty/whitespace, when `disabled`, or while `loading`.
 *
 * Props:
 *  - value: string                       — controlled input value
 *  - onChange: (value: string) => void   — fires on every keystroke
 *  - onSubmit: (value: string) => void   — fires with the trimmed value on send
 *  - placeholder?: string                — default "Ask Copilot to do something…"
 *  - disabled?: boolean                  — fully inert (no typing, no send)
 *  - loading?: boolean                   — work in flight; send shows a spinner
 *  - className?: string
 *
 * Register B (Cowork) tokens + font-fluent only. Heroicons 24px outline.
 */
"use client";

import {
  ArrowUpIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { useId, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { Sparkle } from "./Sparkle";

export type CoworkComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export function CoworkComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask Copilot to do something…",
  disabled = false,
  loading = false,
  className,
}: CoworkComposerProps) {
  const inputId = useId();
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !disabled && !loading;

  function submit() {
    if (!canSend) return;
    onSubmit(trimmed);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div
      className={cn(
        "group flex items-end gap-2 rounded-xl border bg-cw-surface px-3 py-2.5",
        "border-cw-line shadow-cw transition-colors duration-150",
        "focus-within:border-cw-brand focus-within:ring-2 focus-within:ring-cw-brand/25",
        disabled && "opacity-60",
        className,
      )}
    >
      <Sparkle size={18} className="mb-1.5" />
      <label htmlFor={inputId} className="sr-only">
        Message Copilot
      </label>
      <textarea
        id={inputId}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={cn(
          "max-h-40 min-h-[1.5rem] flex-1 resize-none bg-transparent py-1",
          "font-fluent text-sm leading-relaxed text-cw-text",
          "placeholder:text-cw-muted focus:outline-none disabled:cursor-not-allowed",
        )}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
        className={cn(
          "mb-0.5 grid h-8 w-8 place-items-center rounded-control text-cw-muted",
          "transition-colors hover:bg-cw-brand-tint hover:text-cw-brand",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        <PaperClipIcon className="h-5 w-5" />
        <span className="sr-only">Attach a file</span>
      </button>
      <button
        type="button"
        onClick={submit}
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          "mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
          "transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cw-brand",
          canSend
            ? "bg-cw-brand text-white hover:bg-cw-brand-hover"
            : "cursor-not-allowed bg-cw-line text-cw-muted",
        )}
      >
        {loading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
        ) : (
          <ArrowUpIcon className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
}
