/**
 * Field — a labelled input or textarea with an optional hint and error.
 *
 * Two components share one look:
 *  - <Field>      → single-line <input>
 *  - <TextField>  → multi-line <textarea>
 *
 * Common props:
 *  - label: string
 *  - hint?: ReactNode         — helper text under the control
 *  - error?: string           — error message (overrides hint styling)
 *  - required?: boolean       — shows a subtle required marker
 *  - id?: string              — auto-generated if omitted (label/control linked)
 *  - rows?: number            — textarea only
 *  - ...native input/textarea attributes (value, onChange, placeholder, ...)
 *
 * Token-driven; accessible (label htmlFor + aria-describedby + aria-invalid).
 */
import { useId, type ReactNode } from "react";
import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

type CommonProps = {
  label: string;
  hint?: ReactNode;
  error?: string;
  containerClassName?: string;
};

const controlBase =
  "w-full rounded-control border bg-surface px-3 py-2 text-sm text-fg " +
  "placeholder:text-neutral-400 shadow-xs transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  containerClassName,
  children,
}: CommonProps & {
  id: string;
  required?: boolean;
  children: (describedBy: string | undefined) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
        {required && (
          <span className="ml-0.5 text-error-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children(describedBy)}
      {error ? (
        <p id={errorId} className="text-xs text-error-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export type FieldProps = CommonProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
    id?: string;
  };

export function Field({
  label,
  hint,
  error,
  containerClassName,
  className,
  id,
  required,
  ...rest
}: FieldProps) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      containerClassName={containerClassName}
    >
      {(describedBy) => (
        <input
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlBase,
            "h-10",
            error ? "border-error-500" : "border-line-strong",
            className,
          )}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

export type TextFieldProps = CommonProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
    id?: string;
  };

export function TextField({
  label,
  hint,
  error,
  containerClassName,
  className,
  id,
  required,
  rows = 5,
  ...rest
}: TextFieldProps) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      containerClassName={containerClassName}
    >
      {(describedBy) => (
        <textarea
          id={fieldId}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlBase,
            "resize-y leading-relaxed",
            error ? "border-error-500" : "border-line-strong",
            className,
          )}
          {...rest}
        />
      )}
    </FieldShell>
  );
}
