import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowRight } from "lucide-react";

export function WhyPerfAI() {
  const points = [
    {
      title: "Senatria Technology Partnership",
      desc: "Authorised reseller relationship providing commercial access to Senatria's ATRIA platform, BuildingShield, GridShield, ComputeShield, and VERITAS.",
    },
    {
      title: "Customer Engagement",
      desc: "Direct enterprise consultation from discovery briefing to deployment planning, establishing clear return-on-investment parameters.",
    },
    {
      title: "Infrastructure Understanding",
      desc: "Hands-on experience with commercial building systems, BMS protocols, telemetry gateways, and energy metering environments.",
    },
    {
      title: "Deployment Coordination & Support",
      desc: "Dedicated local support ensuring smooth telemetry integration, operator governance bounds, and ongoing performance reviews.",
    },
  ];

  return (
    <section id="about" className="w-full py-20 md:py-28 bg-bg-surface text-white border-t border-border-dark">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <FadeIn className="lg:col-span-5 lg:sticky lg:top-28">
            <Badge variant="default" className="mb-4">
              Why PerfAI
            </Badge>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              The partner between technology and your facility.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
              PerfAI bridges Senatria&apos;s Physical AI with practical commercial adoption, dedicated engineering coordination, and responsive local support.
            </p>
            <Link href="/partner" className="mt-8 inline-block">
              <Button variant="secondary" size="lg">
                <span>About the partnership</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </FadeIn>

          <FadeIn delay={0.12} className="lg:col-span-7">
            <ol className="space-y-0 divide-y divide-border-dark border-y border-border-dark">
              {points.map((p, idx) => (
                <li key={idx} className="py-7 sm:py-8 grid grid-cols-[auto_1fr] gap-5 sm:gap-8">
                  <span className="font-heading font-bold text-2xl sm:text-3xl text-green-primary/50 tabular-nums leading-none pt-0.5">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                      {p.title}
                    </h3>
                    <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
