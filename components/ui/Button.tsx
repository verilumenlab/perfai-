import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep",
          variant === "primary" &&
            "bg-green-primary text-bg-deep font-semibold hover:bg-mint-accent active:opacity-90 shadow-sm",
          variant === "secondary" &&
            "bg-bg-surface text-white border border-border-dark hover:border-green-primary hover:bg-bg-surface/80",
          variant === "ghost" &&
            "text-white/80 hover:text-white hover:bg-white/5",
          size === "sm" && "text-sm px-3.5 py-1.5 h-9 gap-1.5",
          size === "md" && "text-sm px-5 py-2.5 h-11 gap-2",
          size === "lg" && "text-base px-6 py-3.5 h-13 gap-2.5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
