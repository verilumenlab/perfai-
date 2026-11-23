import React from "react";

/**
 * Morning coastal environment:
 * - Distant sea plane with soft morning reflectance.
 * - Coastline sand/shore buffer.
 * - Atmospheric morning haze.
 */
export function BuildingEnvironment() {
  return (
    <group position={[0, 0, 0]}>
      {/* Sea & Ocean Horizon Plane */}
      <mesh position={[0, -0.2, -45]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 80]} />
        <meshStandardMaterial
          color="#0F3830"
          roughness={0.15}
          metalness={0.4}
        />
      </mesh>

      {/* Coastline / Beach Transition Buffer */}
      <mesh position={[0, -0.05, -12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 16]} />
        <meshStandardMaterial
          color="#163D33"
          roughness={0.9}
        />
      </mesh>

      {/* Low morning horizon atmospheric backdrop plane */}
      <mesh position={[0, 20, -80]}>
        <planeGeometry args={[200, 60]} />
        <meshBasicMaterial color="#0A241E" />
      </mesh>
    </group>
  );
}
