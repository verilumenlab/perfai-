import React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-bg-surface border border-border-dark rounded-2xl p-6 sm:p-8 transition-all duration-200 hover:border-green-primary/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
