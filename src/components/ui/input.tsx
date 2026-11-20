import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixText?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      prefixText,
      helperText,
      error,
      id,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-ink"
          >
            {label}
          </label>
        )}

        <div
          className={`flex items-center min-h-[48px] w-full rounded-md border bg-surface transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent ${
            error
              ? "border-error focus-within:outline-error"
              : "border-border hover:border-muted"
          } ${disabled ? "opacity-50 cursor-not-allowed bg-surface-subtle" : ""}`}
        >
          {prefixText && (
            <span className="px-3.5 text-base font-medium text-muted select-none border-r border-border-subtle shrink-0">
              {prefixText}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full h-full px-3.5 py-3 text-base text-body bg-transparent placeholder:text-muted focus:outline-none disabled:cursor-not-allowed ${className}`.trim()}
            {...props}
          />
        </div>

        {error ? (
          <p role="alert" className="text-xs font-semibold text-error">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
