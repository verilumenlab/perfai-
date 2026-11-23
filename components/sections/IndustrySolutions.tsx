import React from "react";
import { industriesContent } from "@/content/industries";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { IndustryCard } from "./IndustryCard";

export function IndustrySolutions() {
  const { heading, subheading, sectors } = industriesContent;

  return (
    <section id="industries" className="w-full py-20 md:py-28 bg-bg-deep text-white border-t border-border-dark">
      <Container>
        <FadeIn>
          <div className="max-w-3xl">
            <Badge variant="default" className="mb-4">
              Infrastructure Sectors
            </Badge>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              {heading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
              {subheading}
            </p>
          </div>
        </FadeIn>

        {/* 5 Industry Cards (Asymmetric responsive grid: 2 on tablet, 3 on desktop, 2 below) */}
        <FadeIn delay={0.2} className="mt-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.slice(0, 3).map((item, index) => (
              <IndustryCard key={item.id} item={item} index={index} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
            {sectors.slice(3).map((item, index) => (
              <IndustryCard key={item.id} item={item} index={index + 3} />
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

