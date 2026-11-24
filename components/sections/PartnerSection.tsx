import Link from "next/link";
import { CheckCircle, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { partnerPageContent } from "@/content/partner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { PartnerForm } from "@/components/forms/PartnerForm";

export function PartnerSection() {
  const { cta } = partnerPageContent;

  return (
    <section id="partner" className="scroll-mt-24 bg-stone py-20 text-ink md:py-28">
      <Container>
        <FadeIn>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
                {cta.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {cta.subheading}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 text-sm text-ink">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  <span>
                    Enterprise partnerships for commercial real estate portfolios and
                    facility managers.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-ink">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  <span>
                    Technical onboarding coordination for BMS integrators, engineers, and
                    energy consultants.
                  </span>
                </div>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <span className="mb-1 block font-mono text-xs uppercase tracking-wider text-forest">
                  Direct Enquiries
                </span>
                <p className="text-sm leading-relaxed text-ink-muted">
                  For corporate procurement and official business correspondence:
                </p>
                <div className="mt-3 flex items-center gap-2.5 font-mono text-sm text-ink">
                  <Mail className="h-3.5 w-3.5 text-forest" />
                  <span>{siteConfig.contact.salesEmail}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/#demo"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
                >
                  <span>{cta.secondaryButtonText}</span>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-bg-panel p-6 sm:p-8 lg:col-span-7">
              <div className="mb-6">
                <span className="block font-mono text-xs uppercase tracking-wider text-forest">
                  Commercial Coordination
                </span>
                <h3 className="font-heading mt-1 text-xl font-bold text-ink">
                  Submit a Partnership Enquiry
                </h3>
              </div>
              <PartnerForm />
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
