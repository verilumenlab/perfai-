import React from "react";
import { Html } from "@react-three/drei";

interface BuildingLabelsProps {
  scrollProgress: number;
  layout?: "beachfront" | "procedural";
}

/**
 * Spatial callouts matching senatria.ai product naming.
 * Appear through exploration stages (0.20 – 0.85).
 */
export function BuildingLabels({
  scrollProgress,
  layout = "procedural",
}: BuildingLabelsProps) {
  if (scrollProgress < 0.2 || scrollProgress > 0.85) {
    return null;
  }

  const chip =
    "bg-bg-deep/95 text-mint-accent px-3 py-1.5 rounded-lg border border-green-primary/40 text-[10px] font-mono whitespace-nowrap shadow-xl";
  const chipNeutral =
    "bg-bg-deep/95 text-white px-3 py-1.5 rounded-lg border border-border-dark text-[10px] font-mono whitespace-nowrap shadow-xl";

  if (layout === "beachfront") {
    const showBuildingShield = scrollProgress >= 0.25;
    const showAtria = scrollProgress >= 0.35;
    const showGrid = scrollProgress >= 0.48;
    const showCompute = scrollProgress >= 0.6;

    return (
      <group>
        {showBuildingShield && (
          <Html position={[7.5, 10.5, -1]} center distanceFactor={18} className="pointer-events-none">
            <div className={chip}>BuildingShield: Asset Optimization</div>
          </Html>
        )}
        {showAtria && (
          <Html position={[10.5, 5.5, -1]} center distanceFactor={18} className="pointer-events-none">
            <div className={chipNeutral}>ATRIA: Physical AI Platform</div>
          </Html>
        )}
        {showGrid && (
          <Html position={[4.2, 1.2, 0]} center distanceFactor={18} className="pointer-events-none">
            <div className={chip}>GridShield: Demand Flexibility</div>
          </Html>
        )}
        {showCompute && (
          <Html position={[9.8, 2.8, 0]} center distanceFactor={18} className="pointer-events-none">
            <div className={chip}>ComputeShield: Edge Capacity</div>
          </Html>
        )}
      </group>
    );
  }

  return (
    <group>
      <Html position={[0, 12.0, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className={chip}>BuildingShield: Asset Optimization</div>
      </Html>
      <Html position={[4.2, 5.8, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className={chipNeutral}>ATRIA: Physical AI Platform</div>
      </Html>
      <Html position={[-4.2, 1.2, 0]} center distanceFactor={22} className="pointer-events-none">
        <div className={chip}>GridShield: Demand Flexibility</div>
      </Html>
      {scrollProgress >= 0.55 && (
        <Html position={[3.5, 2.2, 2]} center distanceFactor={22} className="pointer-events-none">
          <div className={chip}>ComputeShield: Edge Capacity</div>
        </Html>
      )}
    </group>
  );
}
