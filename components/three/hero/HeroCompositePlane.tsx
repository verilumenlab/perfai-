"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useHeroTexture } from "./useHeroTexture";

interface HeroCompositePlaneProps {
  scrollProgress: number;
  reducedMotion?: boolean;
}

/**
 * Single full-bleed cinematic plate — avoids misaligned cutout seams.
 * Camera push-in / slight parallax still provide depth motion.
 */
export function HeroCompositePlane({
  scrollProgress,
  reducedMotion = false,
}: HeroCompositePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useHeroTexture("/images/hero/hero-composite.webp");
  const { camera, size } = useThree();

  const dims = useMemo(() => {
    const distance = 12;
    const vFov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * distance * 1.08;
    const width = height * (size.width / Math.max(size.height, 1)) * 1.08;
    return { width, height, distance };
  }, [camera, size.width, size.height]);

  useFrame(() => {
    if (!meshRef.current || reducedMotion) return;
    // Gentle drift + scroll-linked settle (no torn layers)
    const t = performance.now() * 0.00008;
    meshRef.current.position.x = Math.sin(t) * 0.12 + scrollProgress * 0.35;
    meshRef.current.position.y = Math.cos(t * 0.7) * 0.06 - scrollProgress * 0.2;
    const s = 1 + scrollProgress * 0.06;
    meshRef.current.scale.set(s, s, 1);
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[1.5, 0, -dims.distance]}>
      <planeGeometry args={[dims.width, dims.height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
