import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { applicationContent } from "@/content/application";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
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
  "physical-ai": <Cpu className="w-5 h-5 text-forest" />,
  "digital-twins": <Layers className="w-5 h-5 text-forest" />,
  "ai-agents": <Bot className="w-5 h-5 text-forest" />,
  "infrastructure-intelligence": <Network className="w-5 h-5 text-forest" />,
  "edge-intelligence": <Server className="w-5 h-5 text-forest" />,
  "performance-verification": <ShieldCheck className="w-5 h-5 text-forest" />,
};

export default function ApplicationPage() {
  const { hero, atria, ecosystem, walkthrough, architecture } = applicationContent;

  return (
    <div className="flex flex-col">
      <Section className="pt-10 pb-16 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 bg-bg-canvas border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-4">
                {hero.badge}
              </Badge>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.08]">
                Intelligence That Understands Your Infrastructure.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-2xl leading-relaxed">
                {hero.subheading}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
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

      <Section id="atria" className="py-20 md:py-28 bg-stone border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="mint" className="mb-3">
                {atria.badge}
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                {atria.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
                {atria.description}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-14">
            <div className="border border-line bg-bg-panel rounded-xl p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
                <div>
                  <span className="text-xs font-mono uppercase text-forest tracking-wider font-semibold">
                    Governance Framework
                  </span>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink mt-1">
                    {atria.loopHeading}
                  </h3>
                </div>
                <span className="text-xs font-mono text-ink-muted bg-stone px-3 py-1 rounded-md border border-line self-start sm:self-auto">
                  Deterministic Safety Bounds
                </span>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-px bg-line border border-line">
                {atria.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="bg-bg-panel p-5 flex flex-col justify-between min-h-[140px]"
                  >
                    <div>
                      <span className="text-xs font-mono text-forest font-bold">
                        {st.step}
                      </span>
                      <h4 className="font-heading font-bold text-base text-ink mt-1">
                        {st.name}
                      </h4>
                    </div>
                    <p className="text-xs text-ink-muted mt-3 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-20 md:py-28 bg-bg-canvas border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-3">
                Complete Solution Suite
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                The Senatria Product Ecosystem
              </h2>
              <p className="mt-4 text-base text-ink-muted leading-relaxed">
                Purpose-built modules designed to target infrastructure inefficiencies, unlock capacity, and provide verified evidence.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14 space-y-0 divide-y divide-line border-y border-line">
            {ecosystem.map((prod) => (
              <FadeIn key={prod.id}>
                <article className="py-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-heading font-extrabold text-2xl text-ink">
                          {prod.name}
                        </h3>
                        <Badge variant={prod.category === "Platform" ? "mint" : "default"}>
                          {prod.category}
                        </Badge>
                      </div>
                      <p className="text-xs font-mono text-forest mt-1">
                        {prod.headline}
                      </p>
                    </div>
                    <span className="text-xs text-ink-muted font-mono">
                      {prod.role}
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-ink-muted leading-relaxed max-w-4xl">
                    {prod.description}
                  </p>

                  <div className="mt-6">
                    <span className="text-xs font-semibold text-ink uppercase tracking-wider block mb-3">
                      Core Functional Capabilities
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {prod.capabilities.map((cap, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2.5 text-sm text-ink">
                          <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="walkthrough" className="py-20 md:py-28 bg-stone border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mb-12">
              <Badge variant="default" className="mb-3">
                Architectural Mapping
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                {walkthrough.heading}
              </h2>
              <p className="mt-4 text-base text-ink-muted leading-relaxed">
                {walkthrough.subheading}
              </p>
            </div>
          </FadeIn>

          <BuildingWalkthrough />
        </Container>
      </Section>

      <Section className="py-20 md:py-28 bg-bg-canvas border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-3">
                Technical Foundation
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                {architecture.heading}
              </h2>
              <p className="mt-4 text-base text-ink-muted leading-relaxed">
                {architecture.subheading}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {architecture.pillars.map((pil) => (
                <div key={pil.id} className="border-t border-line pt-6">
                  <div className="mb-3 text-forest">{pillarIcons[pil.id]}</div>
                  <span className="text-[11px] font-mono uppercase text-forest font-bold">
                    {pil.tagline}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-ink mt-1">
                    {pil.title}
                  </h3>
                  <p className="text-sm text-ink-muted mt-3 leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-20 md:py-28 bg-stone">
        <Container>
          <FadeIn>
            <div className="max-w-2xl">
              <Badge variant="default" className="mb-4">
                Deploy Physical AI
              </Badge>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink">
                Explore What Physical AI Can Do for Your Infrastructure.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-ink-muted">
                Schedule a discovery session with PerfAI solutions engineers to evaluate your facility&apos;s BMS feeds, central plants, and energy flexibility.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
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
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline self-center"
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
