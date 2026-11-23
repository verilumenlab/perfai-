import React from "react";
import type { Metadata } from "next";
import { applicationContent } from "@/content/application";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Application Architecture",
  description:
    "Factual overview of how Senatria's Physical AI platform and solutions operate across infrastructure zones.",
};

export default function ApplicationPage() {
  const { header, zones } = applicationContent;

  return (
    <div className="flex flex-col">
      <Section className="pt-16 pb-20 bg-bg-deep border-b border-border-dark">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="default" className="mb-4">
              {header.badge}
            </Badge>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {header.heading}
            </h1>
            <p className="mt-4 text-base text-text-muted leading-relaxed">
              {header.subheading}
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-bg-surface/30">
        <Container>
          <div className="space-y-6">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border-dark">
                  <div>
                    <span className="text-xs font-mono text-green-primary uppercase">
                      {zone.zone}
                    </span>
                    <h2 className="font-heading font-bold text-xl text-white mt-0.5">
                      {zone.title}
                    </h2>
                  </div>
                  <Badge variant="mint">{zone.product}</Badge>
                </div>
                <p className="mt-4 text-sm text-text-muted leading-relaxed">
                  {zone.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/partner">
              <Button variant="primary">
                <span>Discuss Facility Deployment</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
