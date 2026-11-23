import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyPerfAI } from "@/components/sections/WhyPerfAI";
import { PartnerBenefitsSection } from "@/components/sections/PartnerBenefitsSection";
import { PartnerTiersSection } from "@/components/sections/PartnerTiersSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "PerfAI | Building Management Channel Partner",
  description:
    "PerfAI helps businesses adopt building management services for HVAC, energy and facility operations. Request a demonstration for your site.",
  alternates: { canonical: "https://perfai.in/" },
  openGraph: {
    title: "PerfAI | Building Management Channel Partner",
    description:
      "Channel partner for building management services — BMS, HVAC and energy for commercial facilities.",
    url: "https://perfai.in/",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyPerfAI />
      <PartnerBenefitsSection />
      <PartnerTiersSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
