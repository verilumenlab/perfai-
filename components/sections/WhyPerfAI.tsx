import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { ShieldCheck, Workflow, Compass, Headphones } from "lucide-react";

export function WhyPerfAI() {
  const points = [
    {
      title: "Senatria Technology Partnership",
      desc: "Authorised reseller relationship providing commercial access to Senatria's ATRIA platform, BuildingShield, GridShield, ComputeShield, and VERITAS.",
      icon: <ShieldCheck className="w-6 h-6 text-green-primary" />,
    },
    {
      title: "Customer Engagement",
      desc: "Direct enterprise consultation from discovery briefing to deployment planning, establishing clear return-on-investment parameters.",
      icon: <Compass className="w-6 h-6 text-green-primary" />,
    },
    {
      title: "Infrastructure Understanding",
      desc: "Hands-on experience with commercial building systems, BMS protocols, telemetry gateways, and energy metering environments.",
      icon: <Workflow className="w-6 h-6 text-green-primary" />,
    },
    {
      title: "Deployment Coordination & Support",
      desc: "Dedicated local support ensuring smooth telemetry integration, operator governance bounds, and ongoing performance reviews.",
      icon: <Headphones className="w-6 h-6 text-green-primary" />,
    },
  ];

  return (
    <section id="about" className="w-full py-20 md:py-28 bg-bg-deep text-white border-t border-border-dark">
      <Container>
        <FadeIn>
          <div className="max-w-3xl">
            <Badge variant="default" className="mb-4">
              Reseller Partnership Value
            </Badge>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Why Partner with PerfAI?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
              PerfAI bridges Senatria&apos;s Physical AI technology with practical commercial adoption, dedicated engineering coordination, and responsive local support.
            </p>
          </div>
        </FadeIn>

        {/* 4 Points in a 2x2 asymmetric card layout */}
        <FadeIn delay={0.2} className="mt-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {points.map((p, idx) => (
              <div
                key={idx}
                className="bg-bg-surface border border-border-dark rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-green-primary/50 transition-colors"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-bg-deep border border-border-dark flex items-center justify-center mb-5">
                    {p.icon}
                  </div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-2.5 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border-dark">
                  <span className="text-[11px] font-mono text-green-primary font-semibold">
                    Substantiated Reseller Capability
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

