"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { BuildingModel } from "./BuildingModel";
import { BuildingLighting } from "./BuildingLighting";
import { BuildingEnvironment } from "./BuildingEnvironment";
import { ScrollCamera } from "./ScrollCamera";
import { BuildingLabels } from "./BuildingLabels";
import { BuildingPoster } from "./BuildingPoster";

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function checkLowPowerDevice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      return true;
    }
    // @ts-expect-error deviceMemory is supported in Chromium
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      return true;
    }
  } catch {
    // fallback
  }
  return false;
}

export function BuildingScene() {
  const [hasWebGL] = useState(() => checkWebGLSupport());
  const [isLowPower] = useState(() => checkLowPowerDevice());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  // 1. IntersectionObserver to pause rendering when offscreen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Lenis Smooth Scroll & ScrollProgress tracking
  useEffect(() => {
    if (reducedMotion || isLowPower) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        setScrollProgress(progress);
      }
    };

    lenis.on("scroll", onScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      lenis.destroy();
    };
  }, [reducedMotion, isLowPower]);

  // If WebGL is completely unsupported, fallback cleanly to the static poster
  if (!hasWebGL) {
    return <BuildingPoster />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden border border-border-dark bg-bg-surface"
    >
      {/* Static Poster remains visible as LCP until Canvas is ready */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none z-10 ${
          canvasReady && !reducedMotion ? "opacity-0" : "opacity-100"
        }`}
      >
        <BuildingPoster />
      </div>

      {/* 3D WebGL Canvas Layer */}
      {!isLowPower && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          aria-label="Interactive 3D building simulation showing commercial facility architecture"
          role="img"
        >
          <Canvas
            shadows
            dpr={[1, 1.5]} // Limit mobile DPR to 1.5 for performance
            frameloop={isIntersecting ? "always" : "never"} // Pause rendering when offscreen
            camera={{ position: [22, 14, 26], fov: 38, near: 0.5, far: 180 }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: true,
            }}
            onCreated={() => {
              setCanvasReady(true);
            }}
          >
            <color attach="background" args={["#0A241E"]} />
            <fogExp2 attach="fog" args={["#0A241E", 0.014]} />

            <BuildingLighting />
            <BuildingEnvironment />
            <BuildingModel scrollProgress={scrollProgress} />
            <BuildingLabels scrollProgress={scrollProgress} />
            <ScrollCamera
              scrollProgress={scrollProgress}
              reducedMotion={Boolean(reducedMotion)}
            />
          </Canvas>
        </div>
      )}
    </div>
  );
}
