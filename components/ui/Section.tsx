import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  dark?: boolean;
}

export function Section({
  className,
  dark = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "w-full py-16 md:py-24",
        dark ? "bg-bg-deep text-white" : "bg-bg-surface text-white",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

