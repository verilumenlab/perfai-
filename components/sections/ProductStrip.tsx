import React from "react";
import { homeContent } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

export function ProductStrip() {
  const { products } = homeContent;

  return (
    <section
      id="products"
      className="w-full py-14 md:py-16 bg-bg-deep text-white border-t border-border-dark"
      aria-label="Senatria product suite"
    >
      <Container>
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
              Senatria platform &amp; Shield suite
            </h2>
            <p className="text-sm text-text-muted max-w-md">
              Deployed through PerfAI for commercial facilities and infrastructure operators.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-dark border border-border-dark">
            {products.map((p, idx) => (
              <div
                key={p.name}
                className="bg-bg-deep p-6 sm:p-7 flex flex-col gap-3 min-h-[160px]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[11px] font-mono text-mint-accent uppercase tracking-wider">
                    {p.name}
                  </span>
                  <span className="text-[11px] font-mono text-white/30">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-white leading-snug">
                  {p.role}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mt-auto">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
