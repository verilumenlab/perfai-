import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** @deprecated Prefer tone. Kept for call-site compatibility. */
  dark?: boolean;
  tone?: "canvas" | "stone" | "panel";
}

export function Section({
  className,
  dark,
  tone,
  children,
  ...props
}: SectionProps) {
  const resolvedTone =
    tone ?? (dark === false ? "stone" : dark === true ? "canvas" : "canvas");

  return (
    <section
      className={cn(
        "w-full py-16 md:py-24 text-ink",
        resolvedTone === "canvas" && "bg-bg-canvas",
        resolvedTone === "stone" && "bg-stone",
        resolvedTone === "panel" && "bg-bg-panel",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
