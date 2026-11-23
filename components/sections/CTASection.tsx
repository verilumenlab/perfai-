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
          <div className="bg-bg-surface border border-border-dark rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            {/* Ambient accent */}
            <div
              className="absolute top-0 right-0 w-96 h-96 bg-green-primary/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Context & Verified Reassurance Points */}
              <div className="lg:col-span-5">
                <Badge variant="default" className="mb-4">
                  Request a Demonstration
                </Badge>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  Ready to See Physical AI in Action?
                </h2>
                <p className="mt-4 text-base text-text-muted leading-relaxed">
                  Schedule a technical demonstration of Senatria&apos;s ATRIA platform and Shield solutions. Our engineering team will review your infrastructure parameters and explain the deployment process.
                </p>

                <div className="mt-8 space-y-4">
                  {/* Verified point 1: Source senatria.ai/solutions/buildingshield */}
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                    <span>
                      Connects directly with existing Building Management Systems (BMS), HVAC, and sub-metering feeds.
                      <span className="block text-[10px] text-text-muted mt-0.5 font-mono">
                        (Source: senatria.ai — BuildingShield architecture)
                      </span>
                    </span>
                  </div>
                  {/* Verified point 2: Source senatria.ai/platform/atria */}
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
                    <Shield className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                    <span>
                      Autonomous operations execute strictly within pre-approved, site-defined safety boundaries.
                      <span className="block text-[10px] text-text-muted mt-0.5 font-mono">
                        (Source: senatria.ai — ATRIA Governance Engine)
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-bg-deep border border-border-dark">
                  <span className="text-xs font-mono text-mint-accent uppercase tracking-wider block mb-1">
                    Partner Inquiries
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Interested in systems integration, commercial partnership, or distributor relationships?
                  </p>
                  <Link
                    href="/partner#partner-form"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-mint-accent transition-colors"
                  >
                    <span>Explore partnership engagement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive Demo Form */}
              <div className="lg:col-span-7 bg-bg-deep border border-border-dark rounded-2xl p-6 sm:p-8">
                <div className="mb-6">
                  <span className="text-xs font-mono text-mint-accent uppercase tracking-wider block">
                    Enterprise Request Form
                  </span>
                  <h3 className="font-heading font-bold text-xl text-white mt-1">
                    Book an Architectural Demonstration
                  </h3>
                </div>
                <DemoForm />
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
