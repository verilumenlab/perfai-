import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface ScrollCameraProps {
  scrollProgress: number;
  reducedMotion?: boolean;
  /** Beachfront home framing vs legacy procedural walkthrough framing */
  framing?: "beachfront" | "procedural";
}

/**
 * Controls camera across the 6-stage scroll story.
 * Beachfront: slow push-in + slight orbit over ocean/building composition.
 */
export function ScrollCamera({
  scrollProgress,
  reducedMotion = false,
  framing = "procedural",
}: ScrollCameraProps) {
  const { camera } = useThree();
  const currentPos = useRef(
    new THREE.Vector3(
      framing === "beachfront" ? 4 : 22,
      framing === "beachfront" ? 3.5 : 14,
      framing === "beachfront" ? 16 : 26
    )
  );
  const currentLookAt = useRef(
    new THREE.Vector3(framing === "beachfront" ? 4 : 0, framing === "beachfront" ? 2.5 : 5, 0)
  );

  useFrame(() => {
    if (reducedMotion) {
      if (framing === "beachfront") {
        camera.position.set(3.5, 3.2, 14);
        camera.lookAt(5, 2.5, -2);
      } else {
        camera.position.set(20, 12, 22);
        camera.lookAt(0, 5, 0);
      }
      return;
    }

    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    const p = Math.max(0, Math.min(1, scrollProgress));

    if (framing === "beachfront") {
      if (p < 0.15) {
        const t = p / 0.15;
        targetPos.set(
          THREE.MathUtils.lerp(5, 4, t),
          THREE.MathUtils.lerp(4.2, 3.6, t),
          THREE.MathUtils.lerp(18, 15, t)
        );
        targetLookAt.set(5.5, 2.8, -2);
      } else if (p < 0.35) {
        const t = (p - 0.15) / 0.2;
        targetPos.set(
          THREE.MathUtils.lerp(4, 2.5, t),
          THREE.MathUtils.lerp(3.6, 3.0, t),
          THREE.MathUtils.lerp(15, 12, t)
        );
        targetLookAt.set(6, 3, -2);
      } else if (p < 0.55) {
        const t = (p - 0.35) / 0.2;
        const angle = t * Math.PI * 0.22;
        const radius = 12;
        targetPos.set(
          Math.cos(angle) * radius * 0.35 + 1.5,
          THREE.MathUtils.lerp(3.0, 2.8, t),
          Math.sin(angle) * radius + 8
        );
        targetLookAt.set(6.5, 3.2, -1);
      } else if (p < 0.75) {
        const t = (p - 0.55) / 0.2;
        targetPos.set(
          THREE.MathUtils.lerp(2.2, 1.5, t),
          THREE.MathUtils.lerp(2.8, 2.6, t),
          THREE.MathUtils.lerp(11, 9.5, t)
        );
        targetLookAt.set(7, 3.4, -1);
      } else if (p < 0.9) {
        const t = (p - 0.75) / 0.15;
        targetPos.set(
          THREE.MathUtils.lerp(1.5, 0.8, t),
          THREE.MathUtils.lerp(2.6, 2.4, t),
          THREE.MathUtils.lerp(9.5, 8, t)
        );
        targetLookAt.set(7.2, 3.5, 0);
      } else {
        const t = (p - 0.9) / 0.1;
        targetPos.set(
          THREE.MathUtils.lerp(0.8, 0.4, t),
          THREE.MathUtils.lerp(2.4, 2.3, t),
          THREE.MathUtils.lerp(8, 7.2, t)
        );
        targetLookAt.set(7, 3.2, 0);
      }
    } else {
      targetLookAt.set(0, 5, 0);
      if (p < 0.15) {
        const t = p / 0.15;
        targetPos.set(
          THREE.MathUtils.lerp(24, 20, t),
          THREE.MathUtils.lerp(14, 12, t),
          THREE.MathUtils.lerp(28, 22, t)
        );
      } else if (p < 0.35) {
        const t = (p - 0.15) / 0.2;
        targetPos.set(
          THREE.MathUtils.lerp(20, 14, t),
          THREE.MathUtils.lerp(12, 9, t),
          THREE.MathUtils.lerp(22, 16, t)
        );
        targetLookAt.set(0, 5.5, 0);
      } else if (p < 0.55) {
        const t = (p - 0.35) / 0.2;
        const angle = t * Math.PI * 0.45;
        const radius = 18;
        targetPos.set(
          Math.cos(angle) * radius,
          THREE.MathUtils.lerp(9, 7, t),
          Math.sin(angle) * radius + 2
        );
        targetLookAt.set(0, 6, 0);
      } else if (p < 0.75) {
        const t = (p - 0.55) / 0.2;
        targetPos.set(
          THREE.MathUtils.lerp(10, 8, t),
          THREE.MathUtils.lerp(7, 6, t),
          THREE.MathUtils.lerp(15, 12, t)
        );
        targetLookAt.set(0, 6.5, 0);
      } else if (p < 0.9) {
        const t = (p - 0.75) / 0.15;
        targetPos.set(
          THREE.MathUtils.lerp(8, 4.5, t),
          THREE.MathUtils.lerp(6, 4.2, t),
          THREE.MathUtils.lerp(12, 6.5, t)
        );
        targetLookAt.set(0, 4.5, 0);
      } else {
        const t = (p - 0.9) / 0.1;
        targetPos.set(
          THREE.MathUtils.lerp(4.5, 3.5, t),
          THREE.MathUtils.lerp(4.2, 3.8, t),
          THREE.MathUtils.lerp(6.5, 5.5, t)
        );
        targetLookAt.set(0, 4.0, 0);
      }
    }

    currentPos.current.lerp(targetPos, 0.08);
    currentLookAt.current.lerp(targetLookAt, 0.08);
    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
