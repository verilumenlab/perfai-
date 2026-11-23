import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PerfAI Privacy Policy and data disclosures.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  return (
    <Section className="py-20 md:py-28 bg-bg-deep text-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 text-mint-accent">
            Legal Disclosure — Pending Review
          </Badge>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-text-muted mt-2">
            Status: Draft placeholder • Pending legal counsel review
          </p>

          <div className="mt-8 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 text-xs">
            <strong>Notice:</strong> This document contains placeholder terms awaiting formal review by qualified legal counsel. This page is excluded from search engine indexation (noindex).
          </div>

          <div className="mt-8 space-y-6 text-sm text-text-muted leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-white mb-2">1. Overview</h2>
              <p>
                PerfAI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates as an authorised reseller and business partner of Senatria. We respect the privacy of individuals and organisations evaluating Senatria Physical AI solutions.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">2. Information Collection (Placeholder)</h2>
              <p>
                When submitting enquiries through {siteConfig.domain}, information collected is limited to business contact details provided directly by the user (name, work email, organization name, role, phone number, and infrastructure requirements).
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">3. Purpose and Contact</h2>
              <p>
                Information is used solely to respond to commercial enquiries and coordinate technical briefings. For questions regarding data processing, contact:{" "}
                <span className="font-mono text-white">{siteConfig.contact.supportEmail}</span>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </Section>
  );
}

