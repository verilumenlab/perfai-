import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Model asset location constant.
 * Swap with production Draco/meshopt .glb asset when supplied.
 */
export const MODEL_URL: string | null = null;

interface BuildingModelProps {
  scrollProgress: number;
}

export function BuildingModel({ scrollProgress }: BuildingModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const floorLightsRef = useRef<THREE.Mesh[]>([]);

  // Number of commercial floors
  const floorCount = 8;
  const floorHeight = 1.4;
  const buildingWidth = 7.5;
  const buildingDepth = 5.5;

  useFrame(() => {
    // Stage 4 (0.55 - 0.75): Progressive floor illumination
    floorLightsRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const threshold = 0.55 + (index / floorCount) * 0.2;
      const isLit = scrollProgress >= threshold;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.color.set(isLit ? "#75E6AE" : "#1B4D3E");
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Base / Ground Foundation */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[14, 0.2, 12]} />
        <meshStandardMaterial color="#0A1F1B" roughness={0.8} />
      </mesh>

      {/* Plaza & Landscaped Surrounding Walkways */}
      <mesh position={[0, 0.21, 0]} receiveShadow>
        <boxGeometry args={[11, 0.05, 9]} />
        <meshStandardMaterial color="#12352C" roughness={0.7} />
      </mesh>

      {/* 2. Central Structural Core (Visible Service Elevator & Data Conduits) */}
      <mesh position={[0, (floorCount * floorHeight) / 2 + 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, floorCount * floorHeight, 2.4]} />
        <meshStandardMaterial color="#0E2822" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* 3. Floors & Architectural Slabs */}
      {Array.from({ length: floorCount }).map((_, i) => {
        const y = 0.2 + i * floorHeight;
        // Slightly vary slab dimensions for modern architectural rhythm
        const cantilever = i === 2 || i === 5 ? 0.4 : 0;
        const width = buildingWidth + cantilever;
        const depth = buildingDepth + cantilever;

        return (
          <group key={i} position={[0, y, 0]}>
            {/* Concrete Floor Slab */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.2, depth]} />
              <meshStandardMaterial color="#173D33" roughness={0.6} metalness={0.1} />
            </mesh>

            {/* Glass Curtain Facade */}
            <mesh position={[0, floorHeight / 2, 0]}>
              <boxGeometry args={[width - 0.1, floorHeight - 0.2, depth - 0.1]} />
              <meshPhysicalMaterial
                color="#75E6AE"
                transmission={0.85}
                opacity={0.35}
                transparent
                roughness={0.1}
                metalness={0.1}
                ior={1.5}
                reflectivity={0.6}
              />
            </mesh>

            {/* Perimeter Columns */}
            <mesh position={[width / 2 - 0.3, floorHeight / 2, depth / 2 - 0.3]} castShadow>
              <boxGeometry args={[0.2, floorHeight - 0.2, 0.2]} />
              <meshStandardMaterial color="#0A1F1B" roughness={0.5} />
            </mesh>
            <mesh position={[-width / 2 + 0.3, floorHeight / 2, depth / 2 - 0.3]} castShadow>
              <boxGeometry args={[0.2, floorHeight - 0.2, 0.2]} />
              <meshStandardMaterial color="#0A1F1B" roughness={0.5} />
            </mesh>
            <mesh position={[width / 2 - 0.3, floorHeight / 2, -depth / 2 + 0.3]} castShadow>
              <boxGeometry args={[0.2, floorHeight - 0.2, 0.2]} />
              <meshStandardMaterial color="#0A1F1B" roughness={0.5} />
            </mesh>
            <mesh position={[-width / 2 + 0.3, floorHeight / 2, -depth / 2 + 0.3]} castShadow>
              <boxGeometry args={[0.2, floorHeight - 0.2, 0.2]} />
              <meshStandardMaterial color="#0A1F1B" roughness={0.5} />
            </mesh>

            {/* Subtle LED Status Indicator Strip at Slab Edge */}
            <mesh
              ref={(el) => {
                if (el) floorLightsRef.current[i] = el;
              }}
              position={[0, 0.1, depth / 2 + 0.02]}
            >
              <boxGeometry args={[width * 0.8, 0.04, 0.04]} />
              <meshBasicMaterial color="#1B4D3E" />
            </mesh>
          </group>
        );
      })}

      {/* 4. Roof Mechanical Plant Enclosure (BuildingShield Central HVAC) */}
      <group position={[0, 0.2 + floorCount * floorHeight, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[4.5, 1.0, 3.5]} />
          <meshStandardMaterial color="#0B231E" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Chiller units & ventilation cylinders */}
        <mesh position={[-1.2, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.6, 16]} />
          <meshStandardMaterial color="#1A4A3D" roughness={0.5} />
        </mesh>
        <mesh position={[1.2, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.6, 16]} />
          <meshStandardMaterial color="#1A4A3D" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

