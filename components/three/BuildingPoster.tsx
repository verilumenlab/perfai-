import React from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * Static poster fallback — LCP element for hero and reduced-motion path.
 */
export function BuildingPoster({
  variant = "default",
}: {
  variant?: "default" | "hero";
}) {
  const isHero = variant === "hero";

  if (isHero) {
    return (
      <div
        role="region"
        aria-label="Commercial beachfront building visualization (Illustrative)"
        className="relative w-full h-full min-h-[280px] overflow-hidden bg-bg-deep"
      >
        <Image
          src="/images/hero/hero-composite.webp"
          alt="Illustrative modern glass building beside a tropical beach at sunset"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover object-[68%_center]"
        />
        <div
          className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-bg-deep via-bg-deep/70 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Commercial Building Infrastructure Visualization (Illustrative)"
      className={cn(
        "relative w-full overflow-hidden flex flex-col justify-between bg-bg-surface border border-border-dark rounded-xl",
        "aspect-[16/10] sm:aspect-[16/9] max-h-[480px] min-h-[240px] p-6 sm:p-8"
      )}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(35, 168, 117, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(35, 168, 117, 0.35) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-between text-xs text-text-muted">
        <Badge variant="outline" className="text-mint-accent border-border-dark bg-bg-deep">
          Illustrative Architecture Concept
        </Badge>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-6">
        <div className="h-16 w-16 rounded-xl bg-bg-deep border border-green-primary/30 text-mint-accent flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
          Commercial Facility Architecture
        </h3>
        <p className="text-sm text-text-muted max-w-md mt-2 leading-relaxed">
          Physical AI operating loop across HVAC central plants, zone distribution, and edge telemetry.
        </p>
      </div>

      <div className="relative z-10 pt-4 border-t border-border-dark flex items-center justify-between text-[11px] font-mono text-text-muted">
        <span>Model Asset: Procedural Prototype</span>
        <span className="text-mint-accent">Senatria Physical AI</span>
      </div>
    </div>
  );
}
