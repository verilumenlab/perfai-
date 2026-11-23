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
        "bg-bg-panel border border-line rounded-xl p-6 sm:p-8 transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
