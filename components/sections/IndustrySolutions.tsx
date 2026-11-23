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
              Where it applies
            </Badge>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              {heading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
              {subheading}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {sectors.map((item, index) => (
              <IndustryCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
