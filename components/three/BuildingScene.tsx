"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { BuildingModel } from "./BuildingModel";
import { BuildingLighting } from "./BuildingLighting";
import { BuildingEnvironment } from "./BuildingEnvironment";
import { ScrollCamera } from "./ScrollCamera";
import { BuildingLabels } from "./BuildingLabels";
import { BuildingPoster } from "./BuildingPoster";
import { cn } from "@/lib/utils";

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
  if (shouldPreserveDrawingBuffer()) return false;
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

function shouldPreserveDrawingBuffer(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NEXT_PUBLIC_TEST_MODE === "true") return true;
  try {
    return window.location.search.includes("testBuffer=true");
  } catch {
    return false;
  }
}

function getZoneProgress(zoneId?: string): number {
  switch (zoneId) {
    case "overview":
      return 0.1;
    case "hvac":
      return 0.35;
    case "energy":
      return 0.55;
    case "compute":
      return 0.75;
    case "verification":
      return 0.9;
    default:
      return 0.2;
  }
}

interface BuildingSceneProps {
  mode?: "scroll" | "walkthrough";
  activeZoneId?: string;
  className?: string;
  /** Hero uses full-bleed quiet frame */
  variant?: "default" | "hero";
}

export function BuildingScene({
  mode = "scroll",
  activeZoneId,
  className = "",
  variant = "default",
}: BuildingSceneProps) {
  const [hasWebGL] = useState(() => checkWebGLSupport());
  const [isLowPower] = useState(() => checkLowPowerDevice());
  const [preserveDrawingBuffer] = useState(() => shouldPreserveDrawingBuffer());
  const [isMobile, setIsMobile] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  const effectiveProgress =
    mode === "walkthrough" && activeZoneId
      ? getZoneProgress(activeZoneId)
      : 0.2;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll/hero fallback: static poster (motion hero lives in HeroSection)
  if (mode === "scroll" || variant === "hero") {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full overflow-hidden",
          variant === "hero"
            ? "h-full min-h-0 rounded-none border-0"
            : "aspect-[16/10] sm:aspect-[16/9] min-h-[240px] max-h-[520px] rounded-xl border border-border-dark",
          className
        )}
      >
        <BuildingPoster variant={variant === "hero" ? "hero" : "default"} />
      </div>
    );
  }

  // Walkthrough / reduced-motion / no WebGL: static poster
  if (!hasWebGL || reducedMotion || isLowPower) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full overflow-hidden",
          "aspect-[16/10] sm:aspect-[16/9] min-h-[240px] max-h-[520px] rounded-xl border border-border-dark",
          className
        )}
      >
        <BuildingPoster variant="default" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-bg-deep",
        "aspect-[16/10] sm:aspect-[16/9] min-h-[240px] max-h-[520px] rounded-xl border border-border-dark",
        className
      )}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none z-10 ${
          canvasReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <BuildingPoster variant="default" />
      </div>

      <div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        aria-label="Interactive building visualization (Illustrative)"
        role="img"
      >
        <Canvas
          className="w-full h-full block"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            position: "absolute",
            inset: 0,
          }}
          resize={{ debounce: 0, scroll: false }}
          shadows={!isMobile}
          dpr={isMobile ? 1.0 : [1, 1.5]}
          frameloop={isIntersecting || preserveDrawingBuffer ? "always" : "never"}
          camera={{
            position: [22, 14, 26],
            fov: 38,
            near: 0.5,
            far: 180,
          }}
          gl={{
            antialias: !isMobile,
            powerPreference: "high-performance",
            alpha: true,
            preserveDrawingBuffer,
          }}
          onCreated={({ gl, size }) => {
            gl.setSize(size.width, size.height);
            setCanvasReady(true);
          }}
        >
          <color attach="background" args={["#0A241E"]} />
          <fogExp2 attach="fog" args={["#0A241E", 0.014]} />
          <BuildingLighting isMobile={isMobile} />
          <BuildingEnvironment />
          <BuildingModel scrollProgress={effectiveProgress} />
          <BuildingLabels
            scrollProgress={effectiveProgress}
            layout="procedural"
          />
          <ScrollCamera
            scrollProgress={effectiveProgress}
            reducedMotion={Boolean(reducedMotion)}
            framing="procedural"
          />
        </Canvas>
      </div>
    </div>
  );
}
