import * as React from "react";
import { Check } from "lucide-react";

export type BadgeVariant =
  | "neutral"
  | "tiship"
  | "in-stock"
  | "out-of-stock"
  | "queue-low"
  | "queue-moderate"
  | "queue-high"
  | "emergency"
  | "pcn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  icon,
  children,
  className = "",
  ...props
}) => {
  // Never wrap section titles in badges (strictly for status semantics)
  const baseClasses =
    "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border select-none leading-none";

  const variantClasses: Record<BadgeVariant, string> = {
    neutral: "bg-surface-subtle text-muted border-border",
    tiship: "bg-success text-on-success border-success font-bold",
    "in-stock": "bg-success text-on-success border-success",
    "out-of-stock": "bg-surface-subtle text-muted border-border line-through opacity-75",
    "queue-low": "bg-success text-on-success border-success",
    "queue-moderate": "bg-warning text-on-warning border-warning",
    "queue-high": "bg-error text-on-error border-error",
    emergency: "bg-error text-on-error border-error font-bold uppercase tracking-wider",
    pcn: "bg-accent text-on-accent border-accent",
  };

  const defaultIcon =
    variant === "in-stock" && !icon ? <Check className="w-3.5 h-3.5 shrink-0" /> : null;

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {icon ? (
        <span className="inline-block shrink-0">{icon}</span>
      ) : (
        defaultIcon
      )}
      {children}
    </span>
  );
};
