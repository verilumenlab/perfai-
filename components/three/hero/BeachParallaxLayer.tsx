"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useHeroTexture } from "./useHeroTexture";

interface BeachParallaxLayerProps {
  scrollProgress: number;
  reducedMotion?: boolean;
}

export function BeachParallaxLayer({
  scrollProgress,
  reducedMotion = false,
}: BeachParallaxLayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  const texture = useHeroTexture("/images/hero/beach-foreground.webp");

  useEffect(() => {
    if (reducedMotion || size.width < 768) return;

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, size.width]);

  useFrame(() => {
    if (!groupRef.current || reducedMotion) return;
    const targetX = pointer.current.x * 0.45 + scrollProgress * 0.3;
    const targetY = -pointer.current.y * 0.2 - scrollProgress * 0.15;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.06
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      -0.4 + targetY,
      0.06
    );
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} position={[0, -0.4, -8]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[48, 22]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <mesh position={[-6, -1.2, 2]} scale={[0.85, 0.85, 1]}>
        <planeGeometry args={[28, 14]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
