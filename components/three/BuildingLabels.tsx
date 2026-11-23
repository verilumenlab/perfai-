import React from "react";
import { Html } from "@react-three/drei";

interface BuildingLabelsProps {
  scrollProgress: number;
}

/**
 * Spatial callouts marking key solution shield zones on the building:
 * Visible during approach, orbit, and zone inspection stages.
 */
export function BuildingLabels({ scrollProgress }: BuildingLabelsProps) {
  // Show labels when user has scrolled into exploration stages (0.25 to 0.85)
  if (scrollProgress < 0.25 || scrollProgress > 0.85) {
    return null;
  }

  return (
    <group>
      {/* Roof: BuildingShield / Central Plant */}
      <Html position={[0, 12.2, 0]} center distanceFactor={20} className="pointer-events-none">
        <div className="bg-bg-deep/90 text-mint-accent px-2.5 py-1 rounded-md border border-green-primary/40 text-[10px] font-mono whitespace-nowrap shadow-md">
          Zone: BuildingShield (HVAC Plant)
        </div>
      </Html>

      {/* Middle Floors: ATRIA Environmental Governance */}
      <Html position={[4.2, 6.0, 0]} center distanceFactor={20} className="pointer-events-none">
        <div className="bg-bg-deep/90 text-white px-2.5 py-1 rounded-md border border-border-dark text-[10px] font-mono whitespace-nowrap shadow-md">
          ATRIA: Occupancy Loop
        </div>
      </Html>

      {/* Base: GridShield / Utility Interconnection */}
      <Html position={[-4.2, 1.2, 0]} center distanceFactor={20} className="pointer-events-none">
        <div className="bg-bg-deep/90 text-mint-accent px-2.5 py-1 rounded-md border border-green-primary/40 text-[10px] font-mono whitespace-nowrap shadow-md">
          GridShield: Flexible Load
        </div>
      </Html>
    </group>
  );
}
