import React from "react";
import { homeContent } from "@/content/home";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { ExternalLink, CheckCircle } from "lucide-react";

export function TechnologySection() {
  const { technology, products } = homeContent;

  const loopSteps = [
    { step: "01", name: "Perceive", desc: "Ingest live telemetry from BMS, meters, & sensors" },
    { step: "02", name: "Analyse", desc: "Build physics-grounded digital twins & world models" },
    { step: "03", name: "Optimise", desc: "Agent swarms simulate cause-and-effect paths" },
    { step: "04", name: "Control", desc: "Deploy bounded setpoint commands to the edge" },
    { step: "05", name: "Verify", desc: "Log measurable outcomes into the VERITAS ledger" },
    { step: "06", name: "Learn", desc: "Continuously update models for enduring resilience" },
  ];

  return (
    <section id="technology" className="w-full py-20 md:py-28 bg-bg-deep text-white border-t border-border-dark">
      <Container>
        {/* Section Header */}
        <FadeIn>
          <div className="max-w-3xl">
            <Badge variant="default" className="mb-4">
              Technology Platform
            </Badge>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              {technology.heading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
              {technology.description}
            </p>
            <div className="mt-4">
              <a
                href={siteConfig.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-primary hover:underline"
              >
                <span>Learn more at senatria.ai</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Distinction: ATRIA Platform vs Solutions */}
        <FadeIn delay={0.1} className="mt-12">
          <div className="bg-bg-surface rounded-2xl p-6 sm:p-8 border border-border-dark">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-mono uppercase text-green-primary font-bold">
                  Foundational Architecture
                </span>
                <h3 className="font-heading font-bold text-2xl text-white mt-1">
                  The ATRIA Physical AI Platform
                </h3>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  ATRIA is the core operating engine bridging real physical facility assets with predictive models and edge execution. It coordinates specialized AI agent swarms while enforcing deterministic safety boundaries.
                </p>
              </div>
              <div className="bg-bg-deep p-5 rounded-xl border border-border-dark">
                <span className="text-xs font-semibold uppercase text-mint-accent block mb-2">
                  Specialized Solution Shields:
                </span>
                <ul className="space-y-2 text-xs text-text-muted">
                  {products.slice(1).map((prod, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">{prod.name}:</strong> {prod.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ATRIA 6-Step Loop Diagram (SVG/CSS) */}
        <FadeIn delay={0.2} className="mt-16">
          <div className="bg-bg-surface rounded-3xl p-6 sm:p-10 border border-border-dark">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase text-green-primary tracking-wider font-semibold">
                Autonomous Governance
              </span>
              <h3 className="font-heading font-bold text-2xl text-white mt-1">
                The ATRIA Continuous Autonomous Loop
              </h3>
              <p className="text-sm text-text-muted mt-1.5">
                Moving infrastructure from passive data monitoring into safe, governed operational autonomy.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {loopSteps.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-bg-deep border border-border-dark rounded-xl p-4 flex flex-col justify-between hover:border-green-primary/50 transition-colors"
                >
                  <div>
                    <span className="text-xs font-mono text-green-primary font-bold">
                      {item.step}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-white mt-1">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-text-muted mt-3 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* The 6 Core Concepts (Grid variation: 2 rows of 3) */}
        <FadeIn delay={0.3} className="mt-16">
          <h3 className="font-heading font-bold text-2xl text-white mb-6">
            Core Physical AI Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technology.concepts.map((concept) => (
              <div
                key={concept.id}
                className="bg-bg-surface border border-border-dark rounded-2xl p-6 hover:border-green-primary/50 transition-colors"
              >
                <span className="text-[11px] font-mono uppercase tracking-wider text-green-primary font-bold">
                  {concept.name}
                </span>
                <h4 className="font-heading font-bold text-lg text-white mt-1">
                  {concept.title}
                </h4>
                <p className="text-xs sm:text-sm text-text-muted mt-2.5 leading-relaxed">
                  {concept.summary}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

