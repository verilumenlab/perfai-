import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { partnerPageContent } from "@/content/partner";
import { industriesContent } from "@/content/industries";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Handshake,
  Compass,
  Workflow,
  Headphones,
  Mail,
  Building,
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

const stepIcons = [
  <Compass key="1" className="w-5 h-5 text-mint-accent" />,
  <Workflow key="2" className="w-5 h-5 text-mint-accent" />,
  <Handshake key="3" className="w-5 h-5 text-mint-accent" />,
  <Headphones key="4" className="w-5 h-5 text-mint-accent" />,
];

export default function PartnerPage() {
  const { hero, about, partnership, howWeWork, cta } = partnerPageContent;
  const { sectors } = industriesContent;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section className="pt-16 pb-20 md:pt-24 md:pb-28 bg-bg-deep border-b border-border-dark relative overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-green-primary/10 rounded-full blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-4">
                {hero.badge}
              </Badge>
              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
                {hero.headline}
              </h1>
              <p className="mt-6 text-base sm:text-lg text-text-muted max-w-2xl leading-relaxed">
                {hero.subheading}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
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
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-bg-surface border border-border-dark text-white text-base font-semibold hover:border-green-primary transition-colors"
                >
                  <span>{cta.secondaryButtonText}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section 1 — About PerfAI */}
      <Section className="py-20 md:py-28 bg-bg-surface/40 border-b border-border-dark">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="mint" className="mb-3">
                {about.badge}
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {about.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-text-muted leading-relaxed">
                {about.paragraph1}
              </p>
              <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
                {about.paragraph2}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.coreTenets.map((tenet, idx) => (
                <Card key={idx} className="bg-bg-deep border-border-dark flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-green-primary font-bold">
                      0{idx + 1}
                    </span>
                    <h3 className="font-heading font-bold text-base text-white mt-2">
                      {tenet.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      {tenet.desc}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section 2 — Senatria Partnership & Boundaries */}
      <Section className="py-20 md:py-28 bg-bg-deep border-b border-border-dark">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-3">
                {partnership.badge}
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {partnership.title}
              </h2>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                {partnership.description}
              </p>
              <div className="mt-3">
                <span className="text-xs font-mono text-mint-accent bg-bg-surface px-3 py-1 rounded-full border border-green-primary/30 inline-block">
                  Status: {siteConfig.resellerBadge}
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partnership.columns.map((col, idx) => (
                <div
                  key={idx}
                  className="bg-bg-surface border border-border-dark rounded-3xl p-8 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-mono uppercase text-green-primary font-bold">
                      {col.label}
                    </span>
                    <h3 className="font-heading font-bold text-xl text-white mt-1">
                      {col.roleTitle}
                    </h3>

                    <ul className="mt-6 space-y-3">
                      {col.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-text-muted">
                          <CheckCircle className="w-4 h-4 text-green-primary shrink-0 mt-0.5" />
                          <span className="text-white/90">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section 3 — How We Work: 4 Steps */}
      <Section className="py-20 md:py-28 bg-bg-light text-text-main border-b border-border-subtle">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-3 text-text-main border-text-main/20 bg-white">
                {howWeWork.badge}
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-main tracking-tight">
                {howWeWork.title}
              </h2>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                {howWeWork.subheading}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howWeWork.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-green-primary font-bold">
                        {st.step}
                      </span>
                      <div className="h-9 w-9 rounded-lg bg-bg-light border border-border-subtle flex items-center justify-center">
                        {stepIcons[idx]}
                      </div>
                    </div>

                    <span className="text-[11px] font-mono uppercase text-green-primary font-semibold block">
                      {st.name}
                    </span>
                    <h3 className="font-heading font-bold text-base text-text-main mt-0.5">
                      {st.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-2.5 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section 4 — Target Industries */}
      <Section className="py-20 md:py-28 bg-bg-surface/30 border-b border-border-dark">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="default" className="mb-3">
                Industry Coverage
              </Badge>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Sectors We Serve
              </h2>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                Physical AI provides governed operational optimization across high-impact infrastructure sectors.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sec) => (
                <Card key={sec.id} className="bg-bg-deep border-border-dark flex flex-col justify-between">
                  <div>
                    <div className="h-8 w-8 rounded-lg bg-bg-surface border border-border-dark flex items-center justify-center mb-4">
                      <Building className="w-4 h-4 text-green-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-white">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-dark">
                    <Link
                      href="/application"
                      className="text-xs font-semibold text-mint-accent hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Applications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section 5 — Partnership CTA */}
      <Section className="py-20 md:py-28 bg-bg-deep text-white">
        <Container>
          <FadeIn>
            <div className="bg-bg-surface border border-border-dark rounded-3xl p-8 sm:p-14 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <Badge variant="default" className="mb-4">
                    {cta.badge}
                  </Badge>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                    {cta.heading}
                  </h2>
                  <p className="mt-4 text-base text-text-muted leading-relaxed max-w-xl">
                    {cta.subheading}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
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
                      className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm font-semibold hover:border-green-primary transition-colors"
                    >
                      <span>{cta.secondaryButtonText}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-bg-deep border border-border-dark rounded-2xl p-6 sm:p-8">
                  <span className="text-xs font-mono text-mint-accent uppercase tracking-wider block mb-2">
                    Commercial Desk
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Dedicated account representatives coordinate solution scoping and partner discovery.
                  </p>
                  <div className="mt-4 p-3.5 rounded-xl bg-bg-surface border border-border-dark flex items-center gap-3">
                    <Mail className="w-4 h-4 text-green-primary shrink-0" />
                    <span className="font-mono text-xs text-white">
                      {siteConfig.contact.salesEmail}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
