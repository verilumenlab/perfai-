import React from "react";
import { Html } from "@react-three/drei";

interface BuildingLabelsProps {
  scrollProgress: number;
  layout?: "beachfront" | "procedural";
}

/**
 * BMS callouts — beachfront uses screen-space anchors over the composite plate.
 */
export function BuildingLabels({
  scrollProgress,
  layout = "procedural",
}: BuildingLabelsProps) {
  if (scrollProgress < 0.22 || scrollProgress > 0.88) {
    return null;
  }

  const chip =
    "bg-bg-deep/90 text-mint-accent px-3 py-1.5 rounded-lg border border-green-primary/40 text-[10px] font-mono whitespace-nowrap shadow-xl backdrop-blur-sm";
  const chipNeutral =
    "bg-bg-deep/90 text-white px-3 py-1.5 rounded-lg border border-border-dark text-[10px] font-mono whitespace-nowrap shadow-xl backdrop-blur-sm";

  if (layout === "beachfront") {
    const showHvac = scrollProgress >= 0.25;
    const showBms = scrollProgress >= 0.38;
    const showEnergy = scrollProgress >= 0.52;
    const showOps = scrollProgress >= 0.65;

    return (
      <group position={[0, 0, -11]}>
        {showHvac && (
          <Html position={[3.2, 2.4, 0]} center distanceFactor={14} className="pointer-events-none">
            <div className={chip}>HVAC: Plant & Comfort</div>
          </Html>
        )}
        {showBms && (
          <Html position={[4.2, 0.6, 0]} center distanceFactor={14} className="pointer-events-none">
            <div className={chipNeutral}>BMS: Building Control</div>
          </Html>
        )}
        {showEnergy && (
          <Html position={[2.4, -1.6, 0]} center distanceFactor={14} className="pointer-events-none">
            <div className={chip}>Energy: Meters & Demand</div>
          </Html>
        )}
        {showOps && (
          <Html position={[4.6, -0.5, 0]} center distanceFactor={14} className="pointer-events-none">
            <div className={chip}>Operations: Facility Desk</div>
          </Html>
        )}
      </group>
    );
  }

  return (
    <group>
      <Html position={[0, 12.0, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className={chip}>HVAC: Plant & Comfort</div>
      </Html>
      <Html position={[4.2, 5.8, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className={chipNeutral}>BMS: Building Control</div>
      </Html>
      <Html position={[-4.2, 1.2, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className={chip}>Energy: Meters & Demand</div>
      </Html>
      {scrollProgress >= 0.55 && (
        <Html position={[3.5, 2.2, 2]} center distanceFactor={22} className="pointer-events-none">
          <div className={chip}>Operations: Facility Desk</div>
        </Html>
      )}
    </group>
  );
}
