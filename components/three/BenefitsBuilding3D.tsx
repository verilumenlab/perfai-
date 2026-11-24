"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

type BlockProps = {
  position: [number, number, number];
  width: number;
  depth: number;
  floors: number;
  floorHeight: number;
  litPattern: number[];
  rooftop?: "hvac" | "garden";
};

const MULLION_SPACING = 0.5;

function Beacon({ position }: { position: [number, number, number] }) {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const k = 0.5 + 0.5 * Math.sin(t * 2.4);
    if (halo.current) {
      halo.current.scale.setScalar(1 + k * 1.6);
      (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.45 * (1 - k);
    }
    if (core.current) {
      (core.current.material as THREE.MeshBasicMaterial).color.setStyle(
        k > 0.5 ? "#75E6AE" : "#23A875"
      );
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
        <meshStandardMaterial color="#9fb2ab" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh ref={core} position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#75E6AE" toneMapped={false} />
      </mesh>
      <mesh ref={halo} position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#75E6AE" transparent opacity={0.4} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Glass office block: slabs with LED status strips, lit interiors, reflective glass, mullions, rooftop. */
function GlassBlock({
  position,
  width,
  depth,
  floors,
  floorHeight,
  litPattern,
  rooftop = "garden",
}: BlockProps) {
  const height = floors * floorHeight;

  const mullions = useMemo(() => {
    const items: [number, number, number][] = [];
    const nx = Math.max(2, Math.round(width / MULLION_SPACING));
    const nz = Math.max(2, Math.round(depth / MULLION_SPACING));
    for (let i = 0; i <= nx; i++) {
      const x = -width / 2 + (i * width) / nx;
      items.push([x, height / 2, depth / 2 + 0.012]);
      items.push([x, height / 2, -depth / 2 - 0.012]);
    }
    for (let i = 1; i < nz; i++) {
      const z = -depth / 2 + (i * depth) / nz;
      items.push([width / 2 + 0.012, height / 2, z]);
      items.push([-width / 2 - 0.012, height / 2, z]);
    }
    return items;
  }, [width, depth, height]);

  return (
    <group position={position}>
      {Array.from({ length: floors }).map((_, i) => {
        const y = i * floorHeight;
        const lit = litPattern[i % litPattern.length];
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[0, 0.045, 0]}>
              <boxGeometry args={[width + 0.2, 0.09, depth + 0.2]} />
              <meshStandardMaterial color="#f1f5f3" roughness={0.45} />
            </mesh>
            {/* BMS status strip along the slab edge */}
            {i > 0 && (
              <>
                <mesh position={[0, 0.045, depth / 2 + 0.105]}>
                  <boxGeometry args={[width * 0.92, 0.025, 0.01]} />
                  <meshBasicMaterial color="#34d399" toneMapped={false} />
                </mesh>
                <mesh position={[width / 2 + 0.105, 0.045, 0]}>
                  <boxGeometry args={[0.01, 0.025, depth * 0.92]} />
                  <meshBasicMaterial color="#34d399" toneMapped={false} />
                </mesh>
              </>
            )}
            <mesh position={[0, floorHeight * 0.52, 0]}>
              <boxGeometry args={[width - 0.4, floorHeight * 0.58, depth - 0.4]} />
              <meshBasicMaterial
                color={lit > 0.75 ? "#ffe3a6" : lit > 0.5 ? "#f6eedb" : "#cfe7e1"}
                transparent
                opacity={0.6 + lit * 0.4}
              />
            </mesh>
            <mesh position={[0, floorHeight * 0.5 + 0.045, 0]}>
              <boxGeometry args={[width, floorHeight - 0.09, depth]} />
              <meshPhysicalMaterial
                color="#2a7f86"
                metalness={0.6}
                roughness={0.03}
                clearcoat={1}
                clearcoatRoughness={0.04}
                envMapIntensity={1.8}
                transparent
                opacity={0.42}
              />
            </mesh>
          </group>
        );
      })}

      {mullions.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.03, height, 0.03]} />
          <meshStandardMaterial color="#20403a" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}

      <mesh position={[0, height + 0.07, 0]}>
        <boxGeometry args={[width + 0.26, 0.14, depth + 0.26]} />
        <meshStandardMaterial color="#f1f5f3" roughness={0.45} />
      </mesh>

      {rooftop === "hvac" ? (
        <group position={[0, height + 0.14, 0]}>
          {[-0.8, 0.4].map((x, i) => (
            <group key={i} position={[x, 0, -0.4 + i * 0.9]}>
              <mesh position={[0, 0.22, 0]}>
                <boxGeometry args={[1.0, 0.44, 0.7]} />
                <meshStandardMaterial color="#cfd9d4" metalness={0.35} roughness={0.4} />
              </mesh>
              {[-0.24, 0.24].map((fx) => (
                <mesh key={fx} position={[fx, 0.45, 0]}>
                  <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
                  <meshStandardMaterial color="#3a4a45" metalness={0.5} roughness={0.4} />
                </mesh>
              ))}
            </group>
          ))}
          <Beacon position={[1.15, 0, 1.2]} />
        </group>
      ) : (
        <group position={[0, height + 0.14, 0]}>
          {[
            [-0.32, -0.2],
            [0, 0.22],
            [0.3, -0.15],
          ].map(([fx, fz], i) => (
            <mesh key={i} position={[fx * width, 0.24, fz * depth]}>
              <icosahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial color="#4f9b56" roughness={0.8} flatShading />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function Tree({ position, scale = 1, tone = 0 }: { position: [number, number, number]; scale?: number; tone?: number }) {
  const leaf = tone ? "#4c9a52" : "#3a8746";
  const leaf2 = tone ? "#67b26a" : "#55a65b";
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.7, 6]} />
        <meshStandardMaterial color="#6b4f35" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={leaf} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.2, 1.35, 0.08]}>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color={leaf2} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.6, 6]} />
        <meshStandardMaterial color="#2b3b36" />
      </mesh>
      <mesh position={[0, 0.64, 0]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial color="#ffe2a3" toneMapped={false} />
      </mesh>
    </group>
  );
}

function GlowRing() {
  const ring = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const k = 0.5 + 0.5 * Math.sin(t * 1.6);
    if (halo.current) (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.16 + 0.16 * k;
    if (ring.current) ring.current.scale.setScalar(1 + 0.006 * k);
  });
  return (
    <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ring}>
        <torusGeometry args={[6.6, 0.045, 8, 160]} />
        <meshBasicMaterial color="#23A875" toneMapped={false} />
      </mesh>
      <mesh ref={halo}>
        <torusGeometry args={[6.6, 0.24, 8, 160]} />
        <meshBasicMaterial color="#75E6AE" transparent opacity={0.25} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

const TREES: { p: [number, number, number]; s: number; t: number }[] = [
  { p: [-5.6, 0, 2.6], s: 1.1, t: 0 },
  { p: [-6.2, 0, -1.2], s: 0.9, t: 1 },
  { p: [-4.4, 0, -3.8], s: 1, t: 0 },
  { p: [-1.2, 0, -4.9], s: 0.85, t: 1 },
  { p: [2.2, 0, -5.2], s: 1.05, t: 0 },
  { p: [5.4, 0, -3.4], s: 0.95, t: 1 },
  { p: [6.1, 0, 0.4], s: 1.1, t: 0 },
  { p: [5.2, 0, 3.4], s: 0.9, t: 1 },
  { p: [3.2, 0, 4.9], s: 1, t: 0 },
  { p: [-3.4, 0, 4.6], s: 0.95, t: 1 },
];

const LAMPS: [number, number, number][] = [
  [-2.6, 0, 3.6],
  [-0.9, 0, 3.9],
  [0.9, 0, 3.9],
  [2.6, 0, 3.6],
];

function Campus({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (animate && group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group} rotation={[0, -0.55, 0]}>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[7.4, 7.6, 0.16, 120]} />
        <meshStandardMaterial color="#e3ebe7" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.006, 2.7]}>
        <boxGeometry args={[2.2, 0.02, 3.4]} />
        <meshStandardMaterial color="#cbd8d1" roughness={0.9} />
      </mesh>
      <mesh position={[-3.6, 0.012, 1.6]}>
        <cylinderGeometry args={[1.5, 1.5, 0.03, 40]} />
        <meshStandardMaterial color="#93c793" roughness={1} />
      </mesh>
      <mesh position={[3.9, 0.012, 1.8]}>
        <cylinderGeometry args={[1.3, 1.3, 0.03, 40]} />
        <meshStandardMaterial color="#93c793" roughness={1} />
      </mesh>

      <GlowRing />

      <GlassBlock
        position={[-1.5, 0, 0.1]}
        width={5.4}
        depth={3.6}
        floors={4}
        floorHeight={1.05}
        litPattern={[1, 0.6, 0.9, 0.45]}
        rooftop="garden"
      />
      {/* Entrance canopy */}
      <mesh position={[-1.5, 1.0, 2.25]}>
        <boxGeometry args={[1.8, 0.06, 0.7]} />
        <meshStandardMaterial color="#f1f5f3" roughness={0.4} />
      </mesh>
      <GlassBlock
        position={[2.1, 0, -1]}
        width={3.6}
        depth={3.8}
        floors={6}
        floorHeight={1.05}
        litPattern={[0.8, 1, 0.5, 0.9, 0.7, 1]}
        rooftop="hvac"
      />

      {TREES.map((t, i) => (
        <Tree key={i} position={t.p} scale={t.s} tone={t.t} />
      ))}
      {LAMPS.map((p, i) => (
        <Lamp key={i} position={p} />
      ))}
    </group>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Real-time 3D glass office campus used as the centrepiece of the benefits arc. */
export function BenefitsBuilding3D({ reduce }: { reduce: boolean | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setReady(hasWebGL());
  }, []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {ready && (
        <Canvas
          dpr={[1, 1.75]}
          frameloop={visible && !reduce ? "always" : "demand"}
          camera={{ position: [17, 10.5, 20], fov: 30, near: 0.5, far: 120 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ camera }) => camera.lookAt(0, 3.4, 0)}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.55} />
          <hemisphereLight args={["#ffffff", "#cfe3d8", 0.6]} />
          <directionalLight position={[10, 15, 8]} intensity={1.6} color="#fff1dc" />
          <directionalLight position={[-9, 6, -6]} intensity={0.5} color="#75E6AE" />

          {/* In-scene studio environment for glass reflections (no network fetch) */}
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 6, -10]} scale={[16, 6, 1]} />
            <Lightformer form="rect" intensity={1.2} color="#bff5dc" position={[-10, 3, 0]} rotation-y={Math.PI / 2} scale={[12, 4, 1]} />
            <Lightformer form="rect" intensity={1.4} color="#fff1dc" position={[10, 4, 4]} rotation-y={-Math.PI / 2} scale={[12, 5, 1]} />
            <Lightformer form="circle" intensity={3} color="#ffffff" position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={6} />
          </Environment>

          <Campus animate={!reduce} />
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.38}
            scale={18}
            blur={2.6}
            far={9}
            frames={reduce ? 1 : Infinity}
          />
        </Canvas>
      )}
    </div>
  );
}
