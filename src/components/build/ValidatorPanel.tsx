/**
 * ValidatorPanel — renders the result of `validateSkill` as a list of rows.
 *
 * Pure presentational: takes a `Finding[]` (from `validateSkill`) and maps each
 * one straight onto a <ValidatorRow {...finding} />. Shows a compact summary
 * header (counts by level) so the learner can see at a glance whether the skill
 * is ready, plus an empty state while there is nothing to check yet.
 */
import { Card, ValidatorRow } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Finding } from "@/lib/types";

export type ValidatorPanelProps = {
  findings: Finding[];
  className?: string;
};

function countBy(findings: Finding[], level: Finding["level"]): number {
  return findings.filter((f) => f.level === level).length;
}

export function ValidatorPanel({ findings, className }: ValidatorPanelProps) {
  const errors = countBy(findings, "error");
  const warns = countBy(findings, "warn");
  const oks = countBy(findings, "ok");
  const ready = errors === 0;

  return (
    <Card
      as="section"
      padded={false}
      aria-label="Skill validator"
      className={cn("overflow-hidden", className)}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
        <h3 className="eyebrow">Validator</h3>
        <p className="text-xs font-medium" aria-live="polite">
          {findings.length === 0 ? (
            <span className="text-muted">Nothing to check yet</span>
          ) : ready ? (
            <span className="text-ok-700">
              Ready to install
              {warns > 0 ? ` · ${warns} suggestion${warns === 1 ? "" : "s"}` : ""}
            </span>
          ) : (
            <span className="text-error-700">
              {errors} issue{errors === 1 ? "" : "s"} to fix
              {warns > 0 ? ` · ${warns} suggestion${warns === 1 ? "" : "s"}` : ""}
            </span>
          )}
        </p>
      </div>

      <div className="divide-y divide-line px-4 py-2">
        {findings.length === 0 ? (
          <p className="py-3 text-sm text-muted">
            Fill in the fields and checks will appear here.
          </p>
        ) : (
          findings.map((finding, i) => (
            <ValidatorRow key={`${finding.field}-${i}`} {...finding} />
          ))
        )}
      </div>

      <p className="sr-only">
        {oks} passed, {warns} warnings, {errors} errors.
      </p>
    </Card>
  );
}
