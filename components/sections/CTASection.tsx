import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { CheckCircle2, ArrowRight, Shield, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section id="demo" className="w-full py-20 md:py-28 bg-bg-deep text-white border-t border-border-dark">
      <Container>
        <FadeIn>
          <div className="bg-bg-surface border border-border-dark rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            {/* Ambient accent */}
            <div
              className="absolute top-0 right-0 w-96 h-96 bg-green-primary/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Context & Reassurance */}
              <div className="lg:col-span-7">
                <Badge variant="default" className="mb-4">
                  Request a Demonstration
                </Badge>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  Ready to See Physical AI in Action?
                </h2>
                <p className="mt-4 text-base text-text-muted leading-relaxed max-w-xl">
                  Schedule a technical demonstration of Senatria&apos;s ATRIA platform and Shield solutions. Our engineering team will review your infrastructure parameters and explain the deployment process.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                    <span>Evaluation of existing BMS and metering protocols</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
                    <Shield className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                    <span>Governed autonomy operating within pre-approved safety limits</span>
                  </div>
                </div>
              </div>

              {/* Right Column: CTA Placeholder Block for Phase 6 Demo Form */}
              <div className="lg:col-span-5 bg-bg-deep border border-border-dark rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-mint-accent uppercase tracking-wider block">
                    Direct Business Inquiry
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white mt-1">
                    Connect with Solutions Team
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Interactive submission forms will be integrated in Phase 6. In the interim, commercial inquiries can be directed to our business inbox:
                  </p>

                  <div className="mt-4 p-3.5 rounded-xl bg-bg-surface border border-border-dark flex items-center gap-3">
                    <Mail className="w-4 h-4 text-green-primary shrink-0" />
                    <span className="font-mono text-xs text-white">
                      {siteConfig.contact.salesEmail}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-dark">
                  <Link href="/partner" className="w-full block">
                    <Button variant="primary" className="w-full">
                      <span>View Partner & Engagement Details</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

