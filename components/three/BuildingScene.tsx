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
import { Badge } from "@/components/ui/Badge";

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
}

export function BuildingScene({
  mode = "scroll",
  activeZoneId,
  className = "",
}: BuildingSceneProps) {
  const [hasWebGL] = useState(() => checkWebGLSupport());
  const [isLowPower] = useState(() => checkLowPowerDevice());
  const [preserveDrawingBuffer] = useState(() => shouldPreserveDrawingBuffer());
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  // Purely computed progress: for walkthrough mode, map active zone directly without setState in effect
  const effectiveProgress =
    mode === "walkthrough" && activeZoneId
      ? getZoneProgress(activeZoneId)
      : scrollProgress;

  // Mobile viewport detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // 2. Lenis Smooth Scroll tracking (strictly disabled when reducedMotion or isLowPower)
  useEffect(() => {
    if (reducedMotion || isLowPower || mode !== "scroll") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    const onScroll = () => {
      // Calculate scroll progress over the pinned hero and technology sections
      const heroSection = document.getElementById("hero-pin-container");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const totalHeight = heroSection.offsetHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.min(1, Math.max(0, -rect.top / totalHeight));
          setScrollProgress(progress);
        }
      } else {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll > 0) {
          const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
          setScrollProgress(progress);
        }
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
  }, [reducedMotion, isLowPower, mode]);

  // If WebGL is completely unsupported, fallback cleanly to the static poster
  if (!hasWebGL) {
    return <BuildingPoster />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[240px] max-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-border-dark bg-bg-surface ${className}`}
    >
      {/* Illustrative Concept Badge */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <Badge variant="outline" className="text-mint-accent bg-bg-deep/90 border-border-dark text-[10px]">
          Illustrative 3D Concept
        </Badge>
      </div>

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
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          aria-label="Interactive 3D building simulation showing commercial facility architecture (Illustrative)"
          role="img"
        >
          <Canvas
            className="w-full h-full block"
            style={{ width: "100%", height: "100%", display: "block", position: "absolute", inset: 0 }}
            resize={{ debounce: 0, scroll: false }}
            shadows={!isMobile}
            dpr={isMobile ? 1.0 : [1, 1.5]} // Limit mobile DPR to 1.0, desktop to 1.5
            frameloop={isIntersecting || preserveDrawingBuffer ? "always" : "never"} // Pause rendering when offscreen
            camera={{ position: [22, 14, 26], fov: 38, near: 0.5, far: 180 }}
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
            <BuildingLabels scrollProgress={effectiveProgress} />
            <ScrollCamera
              scrollProgress={effectiveProgress}
              reducedMotion={Boolean(reducedMotion)}
            />
          </Canvas>
        </div>
      )}
    </div>
  );
}
