import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface ScrollCameraProps {
  scrollProgress: number;
  reducedMotion?: boolean;
}

/**
 * Controls camera position and lookAt across the 6-stage scroll story:
 * Stage 1 (0.00 - 0.15): Wide architectural overview.
 * Stage 2 (0.15 - 0.35): Slow approach towards the building.
 * Stage 3 (0.35 - 0.55): Camera orbits the exterior.
 * Stage 4 (0.55 - 0.75): Building floors illuminate progressively.
 * Stage 5 (0.75 - 0.90): Camera transitions into selected interior zone.
 * Stage 6 (0.90 - 1.00): Present the application CTA.
 */
export function ScrollCamera({
  scrollProgress,
  reducedMotion = false,
}: ScrollCameraProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(22, 14, 26));
  const currentLookAt = useRef(new THREE.Vector3(0, 5, 0));

  useFrame(() => {
    if (reducedMotion) {
      // Fixed static viewpoint
      camera.position.set(20, 12, 22);
      camera.lookAt(0, 5, 0);
      return;
    }

    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3(0, 5, 0);

    const p = Math.max(0, Math.min(1, scrollProgress));

    if (p < 0.15) {
      // Stage 1: Wide architectural overview
      const t = p / 0.15;
      targetPos.set(
        THREE.MathUtils.lerp(24, 20, t),
        THREE.MathUtils.lerp(14, 12, t),
        THREE.MathUtils.lerp(28, 22, t)
      );
      targetLookAt.set(0, 5, 0);
    } else if (p < 0.35) {
      // Stage 2: Slow approach towards the building
      const t = (p - 0.15) / 0.2;
      targetPos.set(
        THREE.MathUtils.lerp(20, 14, t),
        THREE.MathUtils.lerp(12, 9, t),
        THREE.MathUtils.lerp(22, 16, t)
      );
      targetLookAt.set(0, 5.5, 0);
    } else if (p < 0.55) {
      // Stage 3: Camera orbits the exterior
      const t = (p - 0.35) / 0.2;
      const angle = t * Math.PI * 0.45; // 0 to ~80 deg orbit
      const radius = 18;
      targetPos.set(
        Math.cos(angle) * radius,
        THREE.MathUtils.lerp(9, 7, t),
        Math.sin(angle) * radius + 2
      );
      targetLookAt.set(0, 6, 0);
    } else if (p < 0.75) {
      // Stage 4: Progressive floor illumination
      const t = (p - 0.55) / 0.2;
      targetPos.set(
        THREE.MathUtils.lerp(10, 8, t),
        THREE.MathUtils.lerp(7, 6, t),
        THREE.MathUtils.lerp(15, 12, t)
      );
      targetLookAt.set(0, 6.5, 0);
    } else if (p < 0.90) {
      // Stage 5: Transition into interior central core
      const t = (p - 0.75) / 0.15;
      targetPos.set(
        THREE.MathUtils.lerp(8, 4.5, t),
        THREE.MathUtils.lerp(6, 4.2, t),
        THREE.MathUtils.lerp(12, 6.5, t)
      );
      targetLookAt.set(0, 4.5, 0);
    } else {
      // Stage 6: Application CTA focus
      const t = (p - 0.90) / 0.1;
      targetPos.set(
        THREE.MathUtils.lerp(4.5, 3.5, t),
        THREE.MathUtils.lerp(4.2, 3.8, t),
        THREE.MathUtils.lerp(6.5, 5.5, t)
      );
      targetLookAt.set(0, 4.0, 0);
    }

    // Smooth lerp camera movement
    currentPos.current.lerp(targetPos, 0.08);
    currentLookAt.current.lerp(targetLookAt, 0.08);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

