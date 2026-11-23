import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { applicationContent } from "@/content/application";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { BuildingWalkthrough } from "@/components/application/BuildingWalkthrough";
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Layers,
  Cpu,
  ShieldCheck,
  Server,
  Network,
  Bot,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Senatria Application Architecture & Building Walkthrough",
  description:
    "Explore how Senatria's Physical AI platform (ATRIA, BuildingShield, GridShield, ComputeShield, VERITAS) operates across commercial facilities.",
  alternates: {
    canonical: `${siteConfig.domain}/application`,
  },
  openGraph: {
    title: "Senatria Application Architecture — PerfAI",
    description:
      "Comprehensive walkthrough of Senatria's Physical AI operating platform and Shield solutions inside commercial facilities.",
    url: `${siteConfig.domain}/application`,
    siteName: "PerfAI",
    type: "website",
  },
};

const pillarIcons: Record<string, React.ReactNode> = {
  "physical-ai": <Cpu className="w-5 h-5 text-mint-accent" />,
  "digital-twins": <Layers className="w-5 h-5 text-mint-accent" />,
  "ai-agents": <Bot className="w-5 h-5 text-mint-accent" />,
  "infrastructure-intelligence": <Network className="w-5 h-5 text-mint-accent" />,
  "edge-intelligence": <Server className="w-5 h-5 text-mint-accent" />,
  "performance-verification": <ShieldCheck className="w-5 h-5 text-mint-accent" />,
};

export default function ApplicationPage() {
  const { hero, atria, ecosystem, walkthrough, architecture } = applicationContent;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section className="pt-16 pb-20 md:pt-24 md:pb-28 bg-bg-deep border-b border-border-dark relative overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-green-primary/10 rounded-full blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-4 px-4 py-1.5 shadow-sm border-green-primary/40 bg-bg-surface/80 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-mint-accent animate-pulse" />
                <span>{hero.badge}</span>
              </Badge>
              <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08]">
                Intelligence That Understands{" "}
                <span className="bg-gradient-to-r from-mint-accent via-emerald-300 to-green-primary bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(117,230,174,0.35)]">
                  Your Infrastructure.
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-text-muted max-w-2xl leading-relaxed">
                {hero.subheading}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#atria">
                  <Button variant="primary" size="lg">
                    <span>{hero.ctaPrimary}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </a>
                <Link href="/#demo">
                  <Button variant="secondary" size="lg">
                    <span>{hero.ctaSecondary}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section 1 — ATRIA: The Physical AI Operating Platform */}
      <Section id="atria" className="py-20 md:py-28 bg-bg-surface/50 border-b border-border-dark">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="mint" className="mb-3">
                {atria.badge}
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {atria.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-text-muted leading-relaxed">
                {atria.description}
              </p>
            </div>
          </FadeIn>

          {/* Continuous Loop Visual Diagram */}
          <FadeIn delay={0.2} className="mt-14">
            <div className="bg-bg-surface border border-border-dark rounded-3xl p-6 sm:p-10 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-dark">
                <div>
                  <span className="text-xs font-mono uppercase text-mint-accent tracking-wider font-semibold">
                    Governance Framework
                  </span>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mt-1">
                    {atria.loopHeading}
                  </h3>
                </div>
                <span className="text-xs font-mono text-text-muted bg-bg-deep px-3 py-1 rounded-md border border-border-dark self-start sm:self-auto">
                  Deterministic Safety Bounds
                </span>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {atria.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="bg-bg-deep border border-border-dark rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-mono text-green-primary font-bold">
                        {st.step}
                      </span>
                      <h4 className="font-heading font-bold text-base text-white mt-1">
                        {st.name}
                      </h4>
                    </div>
                    <p className="text-xs text-text-muted mt-3 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section 2 — Product Ecosystem (5 distinct sections) */}
      <Section className="py-20 md:py-28 bg-bg-deep border-b border-border-dark">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-3">
                Complete Solution Suite
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                The Senatria Product Ecosystem
              </h2>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                Purpose-built modules designed to target infrastructure inefficiencies, unlock capacity, and provide verified evidence.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14 space-y-8">
            {ecosystem.map((prod) => (
              <FadeIn key={prod.id}>
                <Card className="bg-bg-surface border-border-dark hover:border-green-primary/50 transition-colors p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-dark">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading font-extrabold text-2xl text-white">
                          {prod.name}
                        </h3>
                        <Badge variant={prod.category === "Platform" ? "mint" : "default"}>
                          {prod.category}
                        </Badge>
                      </div>
                      <p className="text-xs font-mono text-mint-accent mt-1">
                        {prod.headline}
                      </p>
                    </div>

                    <span className="text-xs text-text-muted font-mono">
                      {prod.role}
                    </span>
                  </div>

                  <p className="mt-6 text-sm text-text-muted leading-relaxed max-w-4xl">
                    {prod.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-border-dark">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
                      Core Functional Capabilities:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {prod.capabilities.map((cap, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2.5 text-xs text-white/90">
                          <CheckCircle className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3 — Interactive Building Walkthrough */}
      <Section id="walkthrough" className="py-20 md:py-28 bg-bg-surface/30 border-b border-border-dark">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mb-12">
              <Badge variant="default" className="mb-3">
                Architectural Mapping
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {walkthrough.heading}
              </h2>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                {walkthrough.subheading}
              </p>
            </div>
          </FadeIn>

          {/* Interactive Walkthrough Viewport & Zone Cards */}
          <BuildingWalkthrough />
        </Container>
      </Section>

      {/* Section 4 — Technology Architecture (The 6 Pillars) */}
      <Section className="py-20 md:py-28 bg-bg-surface/30 border-b border-border-dark">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-3">
                Technical Foundation
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {architecture.heading}
              </h2>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                {architecture.subheading}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architecture.pillars.map((pil) => (
                <div
                  key={pil.id}
                  className="bg-bg-deep border border-border-dark rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-green-primary/50 transition-colors"
                >
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-bg-surface border border-border-dark flex items-center justify-center mb-4">
                      {pillarIcons[pil.id]}
                    </div>
                    <span className="text-[11px] font-mono uppercase text-green-primary font-bold">
                      {pil.tagline}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-white mt-1">
                      {pil.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted mt-3 leading-relaxed">
                      {pil.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section 5 — CTA */}
      <Section className="py-20 md:py-28 bg-bg-deep text-white">
        <Container>
          <FadeIn>
            <div className="bg-bg-surface border border-border-dark rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center">
              <Badge variant="default" className="mb-4">
                Deploy Physical AI
              </Badge>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white max-w-2xl">
                Explore What Physical AI Can Do for Your Infrastructure.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-text-muted max-w-xl">
                Schedule a discovery session with PerfAI solutions engineers to evaluate your facility&apos;s BMS feeds, central plants, and energy flexibility.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/#demo">
                  <Button variant="primary" size="lg">
                    <span>Request a Demo</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <a
                  href={siteConfig.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-mint-accent hover:underline self-center px-4"
                >
                  <span>Read Senatria Whitepapers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
