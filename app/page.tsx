import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductStrip } from "@/components/sections/ProductStrip";
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
      {/* Pin while 6-stage scroll story plays, then unpin into content */}
      <div id="hero-pin-container" className="relative" style={{ height: "280vh" }}>
        <div className="sticky top-16 md:top-20 h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)] min-h-[560px]">
          <HeroSection />
        </div>
      </div>

      <ProductStrip />
      <TechnologySection />
      <IndustrySolutions />
      <WhyPerfAI />
      <CTASection />
    </>
  );
}
