"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useHeroTexture } from "./useHeroTexture";

interface OceanLayerProps {
  scrollProgress: number;
  reducedMotion?: boolean;
  lite?: boolean;
}

export function OceanLayer({
  scrollProgress,
  reducedMotion = false,
  lite = false,
}: OceanLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mapRef = useRef<THREE.Texture | null>(null);
  const progressRef = useRef(scrollProgress);
  const texture = useHeroTexture("/images/hero/ocean-horizon.webp", {
    wrap: "repeat",
  });

  useEffect(() => {
    mapRef.current = texture;
  }, [texture]);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useFrame((_, delta) => {
    const map = mapRef.current;
    if (!map || !meshRef.current) return;
    if (!reducedMotion && !lite) {
      map.offset.x = (map.offset.x + delta * 0.012) % 1;
      map.offset.y = (map.offset.y + delta * 0.006) % 1;
    }
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const deepen = 1 - progressRef.current * 0.22;
    mat.color.setRGB(deepen, deepen * 0.88, deepen * 0.78);
  });

  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      position={[4, -1.2, -28]}
      rotation={[-Math.PI / 2.35, 0, 0]}
    >
      <planeGeometry args={[90, 50]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
