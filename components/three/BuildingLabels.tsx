import React from "react";
import { Html } from "@react-three/drei";

interface BuildingLabelsProps {
  scrollProgress: number;
}

/**
 * Spatial callouts marking key solution zones.
 * Claims match senatria.ai exactly:
 * - BuildingShield (Asset Optimization)
 * - ATRIA (Physical AI Operating Platform)
 * - GridShield (Demand Flexibility)
 */
export function BuildingLabels({ scrollProgress }: BuildingLabelsProps) {
  // Show labels when user has scrolled into exploration stages (0.20 to 0.85)
  if (scrollProgress < 0.2 || scrollProgress > 0.85) {
    return null;
  }

  return (
    <group>
      {/* Roof: BuildingShield / Asset Optimization */}
      <Html position={[0, 12.0, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className="bg-bg-deep/95 text-mint-accent px-3 py-1.5 rounded-lg border border-green-primary/40 text-[10px] font-mono whitespace-nowrap shadow-xl">
          BuildingShield: Asset Optimization
        </div>
      </Html>

      {/* Middle Floors: ATRIA Operating Platform */}
      <Html position={[4.2, 5.8, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className="bg-bg-deep/95 text-white px-3 py-1.5 rounded-lg border border-border-dark text-[10px] font-mono whitespace-nowrap shadow-xl">
          ATRIA: Physical AI Platform
        </div>
      </Html>

      {/* Base: GridShield / Demand Flexibility */}
      <Html position={[-4.2, 1.2, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className="bg-bg-deep/95 text-mint-accent px-3 py-1.5 rounded-lg border border-green-primary/40 text-[10px] font-mono whitespace-nowrap shadow-xl">
          GridShield: Demand Flexibility
        </div>
      </Html>
    </group>
  );
}
