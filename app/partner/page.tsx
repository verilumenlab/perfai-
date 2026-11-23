import React from "react";
import type { Metadata } from "next";
import { partnerContent } from "@/content/partner";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Partner & Reseller Role",
  description:
    "About PerfAI: Authorised reseller and deployment partner for Senatria Physical AI.",
};

export default function PartnerPage() {
  const { header, resellerRole, engagementProcess } = partnerContent;

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
          {/* Role definition */}
          <Card className="mb-12">
            <h2 className="font-heading font-bold text-xl text-white">
              {resellerRole.title}
            </h2>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              {resellerRole.description}
            </p>
          </Card>

          {/* 4-step process */}
          <h2 className="font-heading font-bold text-2xl text-white mb-6">
            Engagement Methodology
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementProcess.map((step, idx) => (
              <Card key={idx}>
                <span className="text-xs font-mono text-green-primary font-bold">
                  {step.step}
                </span>
                <h3 className="font-heading font-bold text-base text-white mt-1">
                  {step.title}
                </h3>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  {step.summary}
                </p>
              </Card>
            ))}
          </div>

          {/* Contact placeholder box */}
          <div className="mt-16 bg-bg-surface border border-border-dark rounded-2xl p-8 max-w-xl mx-auto">
            <h3 className="font-heading font-bold text-lg text-white">
              Business Inquiries
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Contact our solutions team for infrastructure briefings.
            </p>
            <div className="mt-4 space-y-2 text-xs text-text-muted">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-primary" />
                <span className="text-white font-mono">{siteConfig.contact.salesEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-primary" />
                <span className="text-white font-mono">{siteConfig.contact.phone}</span>
              </p>
            </div>
            <div className="mt-6">
              <Link href="/">
                <Button variant="secondary" size="sm">
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
