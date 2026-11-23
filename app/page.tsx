import React from "react";
import Link from "next/link";
import { homeContent } from "@/content/home";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const { hero, products, technology } = homeContent;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section className="pt-16 pb-20 md:pt-24 md:pb-32 bg-bg-deep border-b border-border-dark">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="default" className="mb-4">
              {siteConfig.resellerBadge}
            </Badge>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {hero.headline}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl">
              {hero.supportingText}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/application">
                <Button variant="primary" size="lg">
                  <span>Explore Application</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/partner">
                <Button variant="secondary" size="lg">
                  <span>About PerfAI</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Factual Product Suite Overview */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p, idx) => (
              <Card key={idx} className="flex flex-col justify-between">
                <div>
                  <Badge variant="mint" className="mb-2">
                    {p.name}
                  </Badge>
                  <h3 className="font-heading font-bold text-base text-white mt-1">
                    {p.role}
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Technology Architecture Section */}
      <Section className="py-20 bg-bg-surface/40">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase text-mint-accent tracking-wider">
              Platform Architecture
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-2">
              {technology.heading}
            </h2>
            <p className="text-sm text-text-muted mt-2">
              {technology.description}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {technology.concepts.map((concept) => (
              <Card key={concept.id}>
                <span className="text-xs font-mono text-green-primary uppercase">
                  {concept.name}
                </span>
                <h3 className="font-heading font-bold text-base text-white mt-1">
                  {concept.title}
                </h3>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  {concept.summary}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Partnership & Callout */}
      <Section className="py-16 bg-bg-deep border-t border-border-dark">
        <Container>
          <div className="bg-bg-surface border border-border-dark rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading font-bold text-xl text-white">
                Ready to explore Senatria solutions with PerfAI?
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Official reseller and local deployment partner for enterprise infrastructure.
              </p>
            </div>
            <Link href="/partner">
              <Button variant="primary">
                <span>Contact Business Team</span>
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
