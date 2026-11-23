"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useHeroTexture } from "./useHeroTexture";

interface HeroSkyLayerProps {
  scrollProgress: number;
  reducedMotion?: boolean;
}

export function HeroSkyLayer({
  scrollProgress,
  reducedMotion = false,
}: HeroSkyLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useHeroTexture("/images/hero/sky-sunset.webp");

  useFrame(() => {
    if (!meshRef.current || reducedMotion || !texture) return;
    meshRef.current.position.x = Math.sin(performance.now() * 0.00004) * 0.8;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const deepen = 1 - scrollProgress * 0.18;
    mat.color.setRGB(deepen, deepen * 0.92, deepen * 0.85);
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[2, 8, -70]} scale={[1.05, 1.05, 1]}>
      <planeGeometry args={[120, 60]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
