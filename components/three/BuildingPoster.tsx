import React from "react";
import { Building2, Activity, Server, Zap } from "lucide-react";

/**
 * Static poster fallback for the 3D building scroll scene.
 * In Phase 4, the interactive 3D BuildingScene will load progressively over this poster.
 */
export function BuildingPoster() {
  return (
    <div
      role="region"
      aria-label="Commercial Building Infrastructure Visualization"
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] rounded-2xl sm:rounded-3xl border border-border-dark bg-bg-surface overflow-hidden flex flex-col justify-between p-6 sm:p-8"
    >
      {/* Background Architectural Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(35, 168, 117, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(35, 168, 117, 0.4) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      {/* Top Status Indicators */}
      <div className="relative z-10 flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-primary animate-pulse" />
          <span className="font-mono text-white/90 uppercase tracking-wider text-[11px]">
            Building Infrastructure Simulation
          </span>
        </div>
        <span className="font-mono text-mint-accent text-[11px] bg-bg-deep px-2.5 py-1 rounded-md border border-border-dark">
          ATRIA Gateway: Online
        </span>
      </div>

      {/* Central Blueprint Representation */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-6">
        <div className="h-16 w-16 rounded-2xl bg-bg-deep border border-green-primary/30 text-mint-accent flex items-center justify-center mb-4 shadow-lg">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
          Connected Commercial Facility
        </h3>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mt-2 leading-relaxed">
          Continuous telemetry ingestion across HVAC central plants, zone submeters, and edge controllers.
        </p>

        {/* Status badges */}
        <div className="mt-5 flex flex-wrap gap-2 justify-center text-[11px] font-mono">
          <span className="inline-flex items-center gap-1.5 bg-bg-deep px-3 py-1 rounded-lg border border-border-dark text-white/90">
            <Activity className="w-3.5 h-3.5 text-green-primary" />
            Thermodynamic Drift: Monitored
          </span>
          <span className="inline-flex items-center gap-1.5 bg-bg-deep px-3 py-1 rounded-lg border border-border-dark text-white/90">
            <Zap className="w-3.5 h-3.5 text-mint-accent" />
            Demand Response: Ready
          </span>
          <span className="inline-flex items-center gap-1.5 bg-bg-deep px-3 py-1 rounded-lg border border-border-dark text-white/90">
            <Server className="w-3.5 h-3.5 text-green-primary" />
            Edge Bounds: Enforced
          </span>
        </div>
      </div>

      {/* Bottom telemetry line */}
      <div className="relative z-10 pt-4 border-t border-border-dark flex items-center justify-between text-[11px] font-mono text-text-muted">
        <span>Placeholder: Model Asset Ready for Swap (Phase 4)</span>
        <span className="text-mint-accent">Governed Physical AI</span>
      </div>
    </div>
  );
}

