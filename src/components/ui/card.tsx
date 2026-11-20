import * as React from "react";

export type CardVariant = "default" | "subtle" | "emergency";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const variantClasses: Record<CardVariant, string> = {
      default: "bg-surface border-border",
      subtle: "bg-surface-subtle border-border",
      emergency: "bg-surface border-2 border-error",
    };

    return (
      <div
        ref={ref}
        className={`border rounded-lg shadow-sm overflow-hidden ${variantClasses[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-4 md:p-6 border-b border-border-subtle flex flex-col gap-1.5 ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = "h3", className = "", children, ...props }, ref) => {
    // Standing design ban: Never wrap section titles in pill badges or rounded chips
    return (
      <Component
        ref={ref}
        className={`text-lg md:text-xl font-bold text-ink leading-tight tracking-tight ${className}`.trim()}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className = "", children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-muted leading-normal ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-4 md:p-6 ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-4 md:p-6 bg-surface-subtle border-t border-border-subtle flex items-center justify-between ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = "CardFooter";
