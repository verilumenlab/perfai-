import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { IndustrySolutions } from "@/components/sections/IndustrySolutions";
import { WhyPerfAI } from "@/components/sections/WhyPerfAI";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Senatria Technology (ATRIA loop, 6 concepts, Shield suite) */}
      <TechnologySection />

      {/* 3. Industry Solutions (5 sectors) */}
      <IndustrySolutions />

      {/* 4. Why PerfAI (4 value points) */}
      <WhyPerfAI />

      {/* 5. Request a Demo CTA band (id="demo") */}
      <CTASection />
    </>
  );
}
