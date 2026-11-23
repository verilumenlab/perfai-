import React from "react";
import { homeContent } from "@/content/home";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { ExternalLink } from "lucide-react";

export function TechnologySection() {
  const { technology } = homeContent;

  const loopSteps = [
    { step: "01", name: "Perceive", desc: "Ingest live telemetry from BMS, meters, & sensors" },
    { step: "02", name: "Analyse", desc: "Build physics-grounded digital twins & world models" },
    { step: "03", name: "Optimise", desc: "Agent swarms simulate cause-and-effect paths" },
    { step: "04", name: "Control", desc: "Deploy bounded setpoint commands to the edge" },
    { step: "05", name: "Verify", desc: "Log measurable outcomes into the VERITAS ledger" },
    { step: "06", name: "Learn", desc: "Continuously update models for enduring resilience" },
  ];

  return (
    <section id="technology" className="w-full py-20 md:py-28 bg-bg-surface text-white border-t border-border-dark">
      <Container>
        <FadeIn>
          <div className="max-w-3xl">
            <Badge variant="default" className="mb-4">
              How it works
            </Badge>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              {technology.heading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
              {technology.description}
            </p>
            <a
              href={siteConfig.partnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-primary hover:underline"
            >
              <span>Learn more at senatria.ai</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-14 md:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs font-mono uppercase text-green-primary font-bold tracking-wider">
                Foundational Architecture
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-2 leading-tight">
                ATRIA continuous autonomous loop
              </h3>
              <p className="text-sm text-text-muted mt-4 leading-relaxed">
                ATRIA bridges physical facility assets with predictive models and edge execution—coordinating agent swarms inside deterministic safety boundaries.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-px bg-border-dark border border-border-dark">
              {loopSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-bg-deep p-5 sm:p-6 flex flex-col justify-between min-h-[132px]"
                >
                  <div>
                    <span className="text-xs font-mono text-green-primary font-bold">
                      {item.step}
                    </span>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white mt-1">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-text-muted mt-3 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-20 md:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
            <h3 className="font-heading font-bold text-2xl text-white">
              Core Physical AI capabilities
            </h3>
            <p className="text-sm text-text-muted max-w-sm">
              Six foundations that connect digital intelligence to real infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {technology.concepts.map((concept, i) => (
              <div key={concept.id} className="border-t border-border-dark pt-5">
                <span className="text-[11px] font-mono text-white/35">
                  0{i + 1}
                </span>
                <span className="ml-2 text-[11px] font-mono uppercase tracking-wider text-green-primary font-bold">
                  {concept.name}
                </span>
                <h4 className="font-heading font-bold text-lg text-white mt-2">
                  {concept.title}
                </h4>
                <p className="text-sm text-text-muted mt-2.5 leading-relaxed">
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
