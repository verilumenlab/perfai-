import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { DemoForm } from "@/components/forms/DemoForm";

export function CTASection() {
  return (
    <section id="demo" className="w-full py-20 md:py-28 bg-bg-deep text-white border-t border-border-dark scroll-mt-20">
      <Container>
        <FadeIn>
          <div className="mb-12 md:mb-14 max-w-2xl">
            <Badge variant="default" className="mb-4">
              Request a demonstration
            </Badge>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              See Physical AI on your infrastructure terms.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
              Schedule a technical demonstration of Senatria&apos;s ATRIA platform and Shield solutions. Our team will review your facility parameters and deployment path.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-start gap-3 text-sm text-white/90">
                <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                <span>
                  Connects with existing BMS, HVAC, and sub-metering feeds.
                  <span className="block text-[11px] text-text-muted mt-1 font-mono">
                    Source: senatria.ai — BuildingShield
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-white/90">
                <Shield className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                <span>
                  Actions stay inside site-defined safety boundaries.
                  <span className="block text-[11px] text-text-muted mt-1 font-mono">
                    Source: senatria.ai — ATRIA Governance
                  </span>
                </span>
              </div>

              <div className="pt-6 border-t border-border-dark">
                <span className="text-xs font-mono text-mint-accent uppercase tracking-wider block mb-1">
                  Partner inquiries
                </span>
                <p className="text-sm text-text-muted leading-relaxed">
                  Systems integration, commercial partnership, or distribution?
                </p>
                <Link
                  href="/partner#partner-form"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-mint-accent hover:text-white transition-colors"
                >
                  <span>Explore partnership engagement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8 bg-bg-surface border border-border-dark rounded-2xl p-6 sm:p-8 md:p-10">
              <div className="mb-6 pb-5 border-b border-border-dark">
                <span className="text-xs font-mono text-mint-accent uppercase tracking-wider block">
                  Enterprise request
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mt-1">
                  Book an architectural demonstration
                </h3>
              </div>
              <DemoForm />
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
