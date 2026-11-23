"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { MobileNavigation } from "./MobileNavigation";
import { Menu, ArrowRight } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-bg-deep/90 backdrop-blur-md border-b border-border-dark py-3.5 shadow-lg shadow-black/20"
            : "bg-transparent py-5"
        }`}
      >
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand: PerfAI | SENATRIA */}
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent rounded-lg p-0.5"
              aria-label="PerfAI Home"
            >
              <div className="h-9 w-9 rounded-xl bg-green-primary text-bg-deep flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                PerfAI <span className="text-white/40 font-normal">|</span>{" "}
                <span className="text-mint-accent">SENATRIA</span>
              </span>
            </Link>

            <div className="hidden sm:flex items-center h-5 border-l border-border-dark pl-3.5">
              <span className="text-[11px] font-semibold text-mint-accent uppercase tracking-wider bg-bg-surface px-2.5 py-1 rounded-full border border-green-primary/30">
                {siteConfig.resellerBadge}
              </span>
            </div>
          </div>

          {/* Nav links: Home, Application, Partner */}
          <nav
            className="hidden md:flex items-center gap-2 lg:gap-3"
            aria-label="Main Navigation"
          >
            <Link
              href="/"
              className="text-sm font-medium text-white/80 hover:text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              href="/application"
              className="text-sm font-medium text-white/80 hover:text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
            >
              Application
            </Link>
            <Link
              href="/partner"
              className="text-sm font-medium text-white/80 hover:text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
            >
              Partner
            </Link>
          </nav>

          {/* Right CTA & Mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/#demo"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold bg-green-primary text-bg-deep px-4 py-2 rounded-xl hover:bg-mint-accent active:scale-[0.98] transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
            >
              <span>Request a Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 border border-border-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible focus-trapped drawer */}
      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        triggerRef={triggerRef}
      />
    </>
  );
}
