import React from "react";
import { homeContent } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

export function ProductStrip() {
  const { products } = homeContent;

  return (
    <section
      id="products"
      className="w-full border-t border-border-dark bg-bg-deep py-14 text-white md:py-16"
      aria-label="Building management services"
    >
      <Container>
        <FadeIn>
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
              Building management services
            </h2>
            <p className="max-w-md text-sm text-text-muted">
              Delivered through PerfAI for commercial facilities and building operators.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 gap-px border border-border-dark bg-border-dark sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, idx) => (
              <div
                key={p.name}
                className="flex min-h-[160px] flex-col gap-3 bg-bg-deep p-6 sm:p-7"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-mint-accent">
                    {p.name}
                  </span>
                  <span className="font-mono text-[11px] text-white/30">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold leading-snug text-white">
                  {p.role}
                </h3>
                <p className="mt-auto text-sm leading-relaxed text-text-muted">
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
