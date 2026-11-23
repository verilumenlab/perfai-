import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { partnerPageContent } from "@/content/partner";
import { industriesContent } from "@/content/industries";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { PartnerForm } from "@/components/forms/PartnerForm";
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About PerfAI & Senatria Reseller Partnership",
  description:
    "PerfAI is an authorised commercial partner and reseller of Senatria Physical AI infrastructure solutions.",
  alternates: {
    canonical: `${siteConfig.domain}/partner`,
  },
  openGraph: {
    title: "About PerfAI & Senatria Reseller Partnership",
    description:
      "Bringing Senatria Physical AI solutions to commercial infrastructure operators with dedicated customer engagement and deployment coordination.",
    url: `${siteConfig.domain}/partner`,
    siteName: "PerfAI",
    type: "website",
  },
};

export default function PartnerPage() {
  const { hero, about, partnership, howWeWork, cta } = partnerPageContent;
  const { sectors } = industriesContent;

  return (
    <div className="flex flex-col">
      <Section className="pt-10 pb-16 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 bg-bg-canvas border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-4">
                {hero.badge}
              </Badge>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.08]">
                Bringing Physical AI to Businesses. Together.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-2xl leading-relaxed">
                {hero.subheading}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/#demo">
                  <Button variant="primary" size="lg">
                    <span>{cta.primaryButtonText}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <a
                  href={siteConfig.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="lg">
                    <span>{cta.secondaryButtonText}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-20 md:py-28 bg-stone border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="mint" className="mb-3">
                {about.badge}
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                {about.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
                {about.paragraph1}
              </p>
              <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed">
                {about.paragraph2}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-14">
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {about.coreTenets.map((tenet, idx) => (
                <li key={idx} className="border-t border-line pt-5">
                  <span className="text-xs font-mono text-forest font-bold">
                    0{idx + 1}
                  </span>
                  <h3 className="font-heading font-bold text-base text-ink mt-2">
                    {tenet.title}
                  </h3>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {tenet.desc}
                  </p>
                </li>
              ))}
            </ol>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-20 md:py-28 bg-bg-canvas border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-3">
                {partnership.badge}
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                {partnership.title}
              </h2>
              <p className="mt-4 text-base text-ink-muted leading-relaxed">
                {partnership.description}
              </p>
              <p className="mt-3 text-sm font-medium text-forest">
                Status: {siteConfig.resellerBadge}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {partnership.columns.map((col, idx) => (
                <div key={idx} className="border-t border-line pt-6">
                  <span className="text-xs font-mono uppercase text-forest font-bold">
                    {col.label}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-ink mt-1">
                    {col.roleTitle}
                  </h3>
                  <ul className="mt-6 space-y-3">
                    {col.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm text-ink-muted">
                        <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                        <span className="text-ink">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-20 md:py-28 bg-stone border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="mint" className="mb-3">
                {howWeWork.badge}
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                {howWeWork.title}
              </h2>
              <p className="mt-4 text-base text-ink-muted leading-relaxed">
                {howWeWork.subheading}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-14">
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {howWeWork.steps.map((st, idx) => (
                <li key={idx} className="border-t border-line pt-5">
                  <span className="text-xs font-mono text-forest font-bold">
                    {st.step}
                  </span>
                  <span className="text-[11px] font-mono uppercase text-forest font-semibold block mt-3">
                    {st.name}
                  </span>
                  <h3 className="font-heading font-bold text-base text-ink mt-0.5">
                    {st.title}
                  </h3>
                  <p className="text-sm text-ink-muted mt-2.5 leading-relaxed">
                    {st.desc}
                  </p>
                </li>
              ))}
            </ol>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-20 md:py-28 bg-bg-canvas border-b border-line">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-3">
                Industry Coverage
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
                Sectors We Serve
              </h2>
              <p className="mt-4 text-base text-ink-muted leading-relaxed">
                Physical AI provides governed operational optimization across high-impact infrastructure sectors.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {sectors.map((sec, idx) => (
                <div key={sec.id} className="border-t border-line pt-5">
                  <span className="text-[11px] font-mono text-forest">
                    0{idx + 1}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-ink mt-2">
                    {sec.title}
                  </h3>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {sec.description}
                  </p>
                  <Link
                    href="/application"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-ink"
                  >
                    <span>View Applications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section id="partner-form" className="py-20 md:py-28 bg-stone scroll-mt-20">
        <Container>
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              <div className="lg:col-span-5">
                <Badge variant="default" className="mb-4">
                  {cta.badge}
                </Badge>
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight leading-tight">
                  {cta.heading}
                </h2>
                <p className="mt-4 text-base text-ink-muted leading-relaxed">
                  {cta.subheading}
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <span>
                      Enterprise reseller partnerships for commercial real estate portfolios and facility managers.
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <span>
                      Technical onboarding coordination for BMS integrators, engineers, and energy consultants.
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-line">
                  <span className="text-xs font-mono text-forest uppercase tracking-wider block mb-1">
                    Direct Inquiries
                  </span>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    For corporate procurement and official business correspondence:
                  </p>
                  <div className="mt-3 flex items-center gap-2.5 text-sm font-mono text-ink">
                    <Mail className="w-3.5 h-3.5 text-forest" />
                    <span>{siteConfig.contact.salesEmail}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={siteConfig.partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
                  >
                    <span>{cta.secondaryButtonText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 bg-bg-panel border border-line rounded-xl p-6 sm:p-8">
                <div className="mb-6">
                  <span className="text-xs font-mono text-forest uppercase tracking-wider block">
                    Commercial Coordination
                  </span>
                  <h3 className="font-heading font-bold text-xl text-ink mt-1">
                    Submit a Partnership Enquiry
                  </h3>
                </div>
                <PartnerForm />
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
