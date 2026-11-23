import React from "react";

/**
 * Morning lighting setup:
 * - Low warm morning sun casting long soft shadows.
 * - Gentle ambient skylight.
 * - Warm rim light picking up the glass facade.
 */
export function BuildingLighting() {
  return (
    <>
      {/* Low Warm Morning Sun (Directional Light) */}
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
      <hemisphereLight
        args={["#FFE5CC", "#071B17", 0.5]}
      />
    </>
  );
}
