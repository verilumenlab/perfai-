import React from "react";

interface BuildingLightingProps {
  isMobile?: boolean;
}

/**
 * Morning lighting setup:
 * - Low warm morning sun casting soft shadows.
 * - Gentle ambient skylight.
 * - On mobile: shadow maps and secondary lights are bypassed for maximum performance.
 */
export function BuildingLighting({ isMobile = false }: BuildingLightingProps) {
  if (isMobile) {
    return (
      <>
        {/* Simplified mobile lighting: 1 directional light without shadow maps + ambient light */}
        <directionalLight position={[15, 12, 10]} intensity={1.5} color="#FFE5CC" />
        <ambientLight intensity={0.8} color="#A3D4C4" />
      </>
    );
  }

  return (
    <>
      {/* Low Warm Morning Sun (Directional Light with Soft Shadows) */}
      <directionalLight
        position={[18, 12, 14]}
        intensity={1.8}
        color="#FFE5CC"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />

      {/* Gentle Morning Sky Ambient Light */}
      <ambientLight intensity={0.65} color="#A3D4C4" />

      {/* Secondary Soft Fill Light */}
      <directionalLight position={[-15, 8, -12]} intensity={0.4} color="#75E6AE" />

      {/* Subtle Ground Bounce Reflection */}
      <hemisphereLight args={["#FFE5CC", "#071B17", 0.5]} />
    </>
  );
}
