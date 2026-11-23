import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "PerfAI Cookie disclosure policy.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CookiesPage() {
  return (
    <Section className="pt-24 pb-20 sm:pt-28 sm:pb-28 md:pt-32 md:pb-32 bg-bg-canvas text-ink">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-xs text-ink-muted mt-2">
            Status: Draft placeholder • Pending legal counsel review
          </p>

          <div className="mt-8 p-4 rounded-lg border border-amber-600/25 bg-amber-50 text-amber-950 text-xs">
            <strong>Notice:</strong> This document contains placeholder cookie policy terms awaiting formal review by qualified legal counsel. This page is excluded from search engine indexation (noindex).
          </div>

          <div className="mt-8 space-y-6 text-sm text-ink-muted leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-ink mb-2">1. Use of Cookies</h2>
              <p>
                This website uses strictly necessary cookies required for secure navigation and session management. Third-party advertising cookies are not deployed.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-ink mb-2">2. Managing Preferences</h2>
              <p>
                Users can manage cookie preferences directly through their web browser settings.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </Section>
  );
}
