"use client";

import React, { Suspense } from "react";
import { HeroCompositePlane } from "./HeroCompositePlane";
import { AtmosphereLayer } from "./AtmosphereLayer";

interface HeroDepthSceneProps {
  scrollProgress: number;
  reducedMotion?: boolean;
  lite?: boolean;
}

/**
 * Home hero depth scene: one seamless composite plate + light atmosphere.
 * Cutout planes were abandoned — they produced visible seams in production.
 */
export function HeroDepthScene({
  scrollProgress,
  reducedMotion = false,
  lite = false,
}: HeroDepthSceneProps) {
  return (
    <Suspense fallback={null}>
      <HeroCompositePlane
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />
      {!lite && (
        <AtmosphereLayer
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
          lite={lite}
        />
      )}
    </Suspense>
  );
}
