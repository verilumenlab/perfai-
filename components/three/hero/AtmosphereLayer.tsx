"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface AtmosphereLayerProps {
  scrollProgress: number;
  reducedMotion?: boolean;
  lite?: boolean;
}

/** Deterministic pseudo-random in [0,1) */
function hash01(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function AtmosphereLayer({
  scrollProgress,
  reducedMotion = false,
  lite = false,
}: AtmosphereLayerProps) {
  const sunRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = lite || reducedMotion ? 0 : 48;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (hash01(i) - 0.3) * 30;
      positions[i * 3 + 1] = hash01(i + 17) * 16;
      positions[i * 3 + 2] = -5 - hash01(i + 41) * 20;
    }
    return positions;
  }, [lite, reducedMotion]);

  useFrame((_, delta) => {
    if (sunRef.current) {
      const deepen = scrollProgress;
      sunRef.current.position.y = 10 - deepen * 2.5;
      const mat = sunRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + deepen * 0.2;
    }
    if (pointsRef.current && !reducedMotion && !lite) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      <mesh ref={sunRef} position={[14, 10, -55]}>
        <circleGeometry args={[4.5, 32]} />
        <meshBasicMaterial
          color="#FFC48A"
          transparent
          opacity={0.4}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[2, 4, -40]}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial
          color="#FFB889"
          transparent
          opacity={0.06 + scrollProgress * 0.05}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {particles.length > 0 && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#FFE6C8"
            transparent
            opacity={0.35}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
}
