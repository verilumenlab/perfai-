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
import { HeroDepthScene } from "./hero/HeroDepthScene";
import { Badge } from "@/components/ui/Badge";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const useBeachfront = mode === "scroll";
  const lite = isLowPower || isMobile;

  const effectiveProgress =
    mode === "walkthrough" && activeZoneId
      ? getZoneProgress(activeZoneId)
      : scrollProgress;

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

  useEffect(() => {
    if (reducedMotion || mode !== "scroll") return;

    const onScroll = () => {
      const heroSection = document.getElementById("hero-pin-container");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const totalHeight = heroSection.offsetHeight - window.innerHeight;
        if (totalHeight > 0) {
          setScrollProgress(Math.min(1, Math.max(0, -rect.top / totalHeight)));
        }
      }
    };

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!isLowPower) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });
      lenis.on("scroll", onScroll);
      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      lenis?.destroy();
    };
  }, [reducedMotion, isLowPower, mode]);

  // Reduced motion / no WebGL / low-power: static composite poster only
  if (!hasWebGL || reducedMotion || (isLowPower && useBeachfront)) {
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
        <BuildingPoster variant={variant === "hero" || useBeachfront ? "hero" : "default"} />
      </div>
    );
  }

  const showCanvas = !isLowPower;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-bg-deep",
        variant === "hero"
          ? "h-full min-h-0 max-h-none aspect-auto rounded-none border-0"
          : "aspect-[16/10] sm:aspect-[16/9] min-h-[240px] max-h-[520px] rounded-xl border border-border-dark",
        className
      )}
    >
      {variant !== "hero" && mode === "walkthrough" && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <Badge variant="outline" className="text-mint-accent bg-bg-deep/90 border-border-dark text-[10px]">
            Illustrative 3D Concept
          </Badge>
        </div>
      )}

      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none z-10 ${
          canvasReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <BuildingPoster variant={useBeachfront ? "hero" : variant} />
      </div>

      {showCanvas && (
        <div
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          aria-label="Interactive beachfront building visualization (Illustrative)"
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
            shadows={!isMobile && !useBeachfront}
            dpr={isMobile ? 1.0 : [1, 1.5]}
            frameloop={isIntersecting || preserveDrawingBuffer ? "always" : "never"}
            camera={{
              position: useBeachfront ? [4, 3.5, 16] : [22, 14, 26],
              fov: useBeachfront ? 42 : 38,
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
            <color attach="background" args={[useBeachfront ? "#1A0F0C" : "#0A241E"]} />
            <fogExp2
              attach="fog"
              args={[useBeachfront ? "#2A1810" : "#0A241E", useBeachfront ? 0.012 : 0.014]}
            />

            <BuildingLighting isMobile={isMobile} />

            {useBeachfront ? (
              <HeroDepthScene
                scrollProgress={effectiveProgress}
                reducedMotion={Boolean(reducedMotion)}
                lite={lite}
              />
            ) : (
              <>
                <BuildingEnvironment />
                <BuildingModel scrollProgress={effectiveProgress} />
              </>
            )}

            <BuildingLabels
              scrollProgress={effectiveProgress}
              layout={useBeachfront ? "beachfront" : "procedural"}
            />
            <ScrollCamera
              scrollProgress={effectiveProgress}
              reducedMotion={Boolean(reducedMotion)}
              framing={useBeachfront ? "beachfront" : "procedural"}
            />
          </Canvas>
        </div>
      )}
    </div>
  );
}
