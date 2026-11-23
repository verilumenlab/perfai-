"use client";

import React, { Suspense } from "react";
import { HeroSkyLayer } from "./HeroSkyLayer";
import { OceanLayer } from "./OceanLayer";
import { BeachParallaxLayer } from "./BeachParallaxLayer";
import { BuildingPlane } from "./BuildingPlane";
import { AtmosphereLayer } from "./AtmosphereLayer";

interface HeroDepthSceneProps {
  scrollProgress: number;
  reducedMotion?: boolean;
  lite?: boolean;
}

/**
 * Layered beachfront depth stack for the home hero (single canvas).
 * Walkthrough mode continues to use BuildingModel + BuildingEnvironment.
 */
export function HeroDepthScene({
  scrollProgress,
  reducedMotion = false,
  lite = false,
}: HeroDepthSceneProps) {
  return (
    <Suspense fallback={null}>
      <HeroSkyLayer scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      <OceanLayer
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        lite={lite}
      />
      <BeachParallaxLayer
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />
      <BuildingPlane
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />
      <AtmosphereLayer
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        lite={lite}
      />
    </Suspense>
  );
}
