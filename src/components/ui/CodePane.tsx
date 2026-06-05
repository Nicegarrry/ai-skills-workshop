"use client";

/**
 * CodePane — a dark monospace panel with a filename tab and copy-to-clipboard.
 *
 * Props:
 *  - filename: string     — shown in the tab (e.g. "SKILL.md")
 *  - code: string         — the text rendered + copied
 *  - language?: string    — informational label (e.g. "markdown"); not parsed
 *  - highlight?: boolean  — apply lightweight markdown/YAML token tinting (default true)
 *  - copyable?: boolean   — show the copy button (default true)
 *  - maxHeight?: string   — CSS max-height for the scroll area (e.g. "24rem")
 *  - className?: string
 *
 * Dark pane regardless of theme (per the workbench aesthetic). Highlighting is
 * deliberately minimal — a styled <pre> with a few regex-tinted spans, no heavy
 * syntax dep. Client component (uses the clipboard API + local "copied" state).
 */
import { useCallback, useState } from "react";
import {
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

export type CodePaneProps = {
  filename: string;
  code: string;
  language?: string;
  highlight?: boolean;
  copyable?: boolean;
  maxHeight?: string;
  className?: string;
};

/** Escape HTML so user content can't inject markup before we tint it. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Lightweight, line-based tinting for markdown + YAML frontmatter. Operates on
 * already-escaped text and only wraps whole lines / leading tokens, so it can't
 * produce unbalanced tags. Returns an HTML string for dangerouslySetInnerHTML.
 */
function tint(code: string): string {
  const escaped = escapeHtml(code);
  const lines = escaped.split("\n");
  let inFrontmatter = false;

  const out = lines.map((line, i) => {
    if (line.trim() === "---") {
      // Toggle frontmatter on the first/second fence.
      inFrontmatter = i === 0 ? true : !inFrontmatter;
      return `<span class="text-neutral-500">${line}</span>`;
    }
    if (inFrontmatter) {
      // key: value  → tint the key
      const m = line.match(/^(\s*)([A-Za-z0-9_-]+)(:)(.*)$/);
      if (m) {
        return `${m[1]}<span class="text-accent-300">${m[2]}</span><span class="text-neutral-500">${m[3]}</span><span class="text-neutral-200">${m[4]}</span>`;
      }
      return line;
    }
    // Markdown headings
    if (/^#{1,6}\s/.test(line)) {
      return `<span class="text-accent-300 font-semibold">${line}</span>`;
    }
    // List markers / numbered steps
    if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      return line.replace(
        /^(\s*)([-*]|\d+\.)(\s)/,
        '$1<span class="text-ok-500">$2</span>$3',
      );
    }
    return line;
  });

  return out.join("\n");
}

export function CodePane({
  filename,
  code,
  language,
  highlight = true,
  copyable = true,
  maxHeight,
  className,
}: CodePaneProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context / permissions) — silently no-op.
    }
  }, [code]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-neutral-800 bg-panel shadow-card",
        className,
      )}
    >
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-panel-line bg-panel-2 px-3 py-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          </span>
          <span className="font-mono font-medium text-panel-fg">{filename}</span>
          {language && (
            <span className="rounded-pill bg-neutral-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-panel-muted">
              {language}
            </span>
          )}
        </div>
        {copyable && (
          <button
            type="button"
            onClick={onCopy}
            aria-label={copied ? "Copied" : `Copy ${filename}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-xs font-medium",
              "text-panel-muted transition-colors hover:bg-neutral-800 hover:text-panel-fg",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
            )}
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 text-ok-500" aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-4 w-4" aria-hidden="true" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Code */}
      <div className="overflow-auto" style={maxHeight ? { maxHeight } : undefined}>
        <pre className="px-4 py-3 font-mono text-[13px] leading-relaxed text-panel-fg">
          {highlight ? (
            // Safe: `tint` HTML-escapes the input FIRST, then only wraps the
            // already-escaped text in fixed span tags — user content cannot
            // introduce raw markup, so no XSS surface (no sanitizer needed).
            <code dangerouslySetInnerHTML={{ __html: tint(code) }} />
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
