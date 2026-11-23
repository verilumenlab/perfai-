import React from "react";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

/**
 * Static poster fallback for the 3D building scroll scene.
 * Serves as the LCP asset and fallback for reduced-motion / low-power / WebGL disabled devices.
 * Clearly labeled as an illustrative architectural concept.
 */
export function BuildingPoster() {
  return (
    <div
      role="region"
      aria-label="Commercial Building Infrastructure Visualization (Illustrative)"
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[480px] rounded-2xl sm:rounded-3xl border border-border-dark bg-bg-surface overflow-hidden flex flex-col justify-between p-6 sm:p-8"
    >
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(35, 168, 117, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(35, 168, 117, 0.3) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      {/* Top Indicators */}
      <div className="relative z-10 flex items-center justify-between text-xs text-text-muted">
        <Badge variant="outline" className="text-mint-accent border-border-dark bg-bg-deep">
          Illustrative Architecture Concept
        </Badge>
        <span className="font-mono text-text-muted text-[11px] hidden sm:inline">
          Architectural Digital Twin Preview
        </span>
      </div>

      {/* Central Blueprint Representation */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-6">
        <div className="h-16 w-16 rounded-2xl bg-bg-deep border border-green-primary/30 text-mint-accent flex items-center justify-center mb-4 shadow-lg">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
          Commercial Facility Architecture
        </h3>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mt-2 leading-relaxed">
          Physical AI operating loop across HVAC central plants, zone distribution, and edge telemetry.
        </p>
      </div>

      {/* Bottom telemetry line */}
      <div className="relative z-10 pt-4 border-t border-border-dark flex items-center justify-between text-[11px] font-mono text-text-muted">
        <span>Model Asset: Procedural Prototype</span>
        <span className="text-mint-accent">Senatria Physical AI</span>
      </div>
    </div>
  );
}
