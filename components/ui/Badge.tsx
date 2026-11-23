import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "mint" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
        variant === "default" &&
          "bg-bg-surface text-mint-accent border border-green-primary/30",
        variant === "mint" &&
          "bg-mint-accent/15 text-mint-accent border border-mint-accent/30",
        variant === "outline" &&
          "bg-transparent text-white/80 border border-border-dark",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
