"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MODEL_URL } from "../BuildingModel";
import { useHeroTexture } from "./useHeroTexture";

interface BuildingPlaneProps {
  scrollProgress: number;
  reducedMotion?: boolean;
}

/**
 * Layer 3 — photoreal building plane.
 * When MODEL_URL is set, a GLB can replace this plane without a second canvas.
 */
export function BuildingPlane({
  scrollProgress,
  reducedMotion = false,
}: BuildingPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useHeroTexture("/images/hero/building-glass.webp");

  useFrame(() => {
    if (!meshRef.current || reducedMotion) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const lightT =
      scrollProgress < 0.55
        ? 0.25
        : scrollProgress > 0.75
        ? 1
        : 0.25 + ((scrollProgress - 0.55) / 0.2) * 0.75;
    mat.emissiveIntensity = lightT * 0.55;
    mat.metalness = 0.35 + lightT * 0.15;
  });

  void MODEL_URL;

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[7.5, 3.2, -2]} scale={[1, 1, 1]}>
      <planeGeometry args={[14, 18]} />
      <meshStandardMaterial
        map={texture}
        transparent
        roughness={0.35}
        metalness={0.4}
        emissive="#FFB070"
        emissiveIntensity={0.25}
        toneMapped
      />
    </mesh>
  );
}
