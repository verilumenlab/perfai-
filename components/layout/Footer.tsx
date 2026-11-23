import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-bg-deep border-t border-border-dark text-white/70 pt-16 pb-12">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-border-dark">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-primary text-bg-deep flex items-center justify-center font-bold text-sm">
                P
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                PerfAI
              </span>
            </Link>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">
              PerfAI is an authorised reseller and business partner of Senatria,
              delivering Physical AI solutions for commercial buildings, data centres, and energy infrastructure.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-mint-accent bg-bg-surface px-3 py-1.5 rounded-lg border border-green-primary/20 w-fit">
              <span>{siteConfig.partnershipTagline}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-heading font-semibold text-sm text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/application" className="hover:text-white transition-colors">
                  Application
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-white transition-colors">
                  Partner
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="text-mint-accent hover:underline transition-colors">
                  Request a Demo
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-heading font-semibold text-sm text-white uppercase tracking-wider">
              Technology Partner
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li>
                <a
                  href={siteConfig.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white hover:text-mint-accent transition-colors"
                >
                  <span>Senatria Official Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <span className="text-white/70">ATRIA Platform</span>
              </li>
              <li>
                <span className="text-white/70">BuildingShield</span>
              </li>
              <li>
                <span className="text-white/70">GridShield</span>
              </li>
              <li>
                <span className="text-white/70">ComputeShield</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-heading font-semibold text-sm text-white uppercase tracking-wider">
              Business Contact
            </h4>
            <div className="flex flex-col gap-2 text-xs text-text-muted">
              <p>
                <span className="text-white/60 block">Inquiries:</span>
                <span className="text-white font-mono">{siteConfig.contact.salesEmail}</span>
              </p>
              <p>
                <span className="text-white/60 block">Phone:</span>
                <span className="text-white font-mono">{siteConfig.contact.phone}</span>
              </p>
              <p>
                <span className="text-white/60 block">Office:</span>
                <span>
                  {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© 2026 PerfAI. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
