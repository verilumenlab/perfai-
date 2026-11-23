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
          "inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-canvas disabled:cursor-not-allowed disabled:opacity-50",
          variant === "primary" &&
            "bg-green-primary font-semibold text-white shadow-sm hover:bg-forest active:opacity-90",
          variant === "secondary" &&
            "border border-ink/15 bg-ink text-white hover:bg-ink/90",
          variant === "ghost" &&
            "text-ink/75 hover:bg-ink/5 hover:text-ink",
          size === "sm" && "h-9 gap-1.5 px-3.5 py-1.5 text-sm",
          size === "md" && "h-11 gap-2 px-5 py-2.5 text-sm",
          size === "lg" && "h-13 gap-2.5 px-6 py-3.5 text-base",
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
