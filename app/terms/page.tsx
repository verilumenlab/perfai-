import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "PerfAI Terms and Conditions of service.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <Section className="pt-28 pb-20 sm:pt-36 sm:pb-28 md:pt-40 md:pb-32 bg-bg-deep text-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 text-mint-accent">
            Legal Disclosure — Pending Review
          </Badge>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-text-muted mt-2">
            Status: Draft placeholder • Pending legal counsel review
          </p>

          <div className="mt-8 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 text-xs">
            <strong>Notice:</strong> This document contains placeholder terms awaiting formal review by qualified legal counsel. This page is excluded from search engine indexation (noindex).
          </div>

          <div className="mt-8 space-y-6 text-sm text-text-muted leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-white mb-2">1. Reseller Relationship</h2>
              <p>
                PerfAI is an authorised reseller and business partner of Senatria. PerfAI does not manufacture or claim proprietary ownership of Senatria software, hardware gateways, models, or algorithms. Senatria technology (including ATRIA, BuildingShield, GridShield, ComputeShield, and VERITAS) is licensed subject to Senatria&apos;s commercial software license agreements.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">2. Informational Use Only</h2>
              <p>
                Content on {siteConfig.domain} is published for preliminary commercial evaluation. Definitive operational service levels, performance verification parameters, and warranties are governed by formal bilateral contracts.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </Section>
  );
}

