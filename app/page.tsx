import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { HeroSection } from "@/components/sections/HeroSection";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { IndustrySolutions } from "@/components/sections/IndustrySolutions";
import { WhyPerfAI } from "@/components/sections/WhyPerfAI";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "PerfAI — Physical AI for Commercial Infrastructure",
  description:
    "PerfAI is an authorised commercial partner and reseller of Senatria's Physical AI platform: ATRIA, BuildingShield, GridShield, ComputeShield & VERITAS.",
  alternates: {
    canonical: siteConfig.domain,
  },
  openGraph: {
    title: "PerfAI — Physical AI for Commercial Infrastructure",
    description:
      "Transforming commercial facilities into sentient, autonomous, and governed environments through Senatria Physical AI.",
    url: siteConfig.domain,
    siteName: "PerfAI",
    type: "website",
  },
};

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
