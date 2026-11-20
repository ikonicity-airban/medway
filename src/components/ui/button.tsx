import * as React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "emergency"
  | "warning"
  | "ghost";

export type ButtonSize = "default" | "sm" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      fullWidth = false,
      className = "",
      disabled = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles: 48px minimum touch target, visible 2px focus ring, no pulse animations
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors select-none " +
      "focus-visible:outline-2 focus-visible:outline-offset-2 " +
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        "bg-accent text-on-accent hover:opacity-95 active:opacity-90 focus-visible:outline-accent",
      secondary:
        "bg-surface text-body border border-border hover:bg-surface-subtle active:bg-border-subtle focus-visible:outline-border",
      emergency:
        "bg-error bg-[var(--color-error)] text-on-error font-semibold hover:opacity-95 active:opacity-90 focus-visible:outline-error",
      warning:
        "bg-warning text-on-warning font-semibold hover:opacity-95 active:opacity-90 focus-visible:outline-warning",
      ghost:
        "bg-transparent text-body hover:bg-surface-subtle active:bg-border-subtle focus-visible:outline-accent",
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: "min-h-[44px] px-3 py-2 text-sm rounded-md",
      default: "min-h-[48px] px-4 py-3 text-base rounded-md",
      lg: "min-h-[56px] px-6 py-4 text-lg rounded-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
