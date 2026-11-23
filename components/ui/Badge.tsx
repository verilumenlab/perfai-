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
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        variant === "default" &&
          "border border-green-primary/30 bg-bg-surface text-mint-accent",
        variant === "mint" &&
          "border border-forest/20 bg-green-primary/10 text-forest",
        variant === "outline" &&
          "border border-line bg-transparent text-ink/70",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
