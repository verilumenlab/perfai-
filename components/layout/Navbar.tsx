"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
            ? "bg-bg-deep/85 backdrop-blur-xl border-b border-border-dark/80 py-3 shadow-xl shadow-black/40"
            : "bg-bg-deep/40 backdrop-blur-md border-b border-white/5 py-4"
        }`}
      >
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand: PerfAI Logo and Name only */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent rounded-xl p-1 -ml-1 transition-all"
            aria-label="PerfAI Homepage"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-green-primary to-mint-accent text-bg-deep flex items-center justify-center font-heading font-extrabold text-lg shadow-md shadow-green-primary/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-mint-accent transition-colors">
              PerfAI
            </span>
          </Link>

          {/* Nav links: Home, Application, Partner */}
          <nav
            className="hidden md:flex items-center gap-1 bg-bg-surface/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border-dark shadow-inner"
            aria-label="Main Navigation"
          >
            <Link
              href="/"
              className="text-xs font-semibold px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/application"
              className="text-xs font-semibold px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Application
            </Link>
            <Link
              href="/partner"
              className="text-xs font-semibold px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Partner
            </Link>
          </nav>

          {/* Right CTA & Mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/#demo"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold bg-green-primary text-bg-deep px-4 py-2.5 rounded-full hover:bg-mint-accent active:scale-[0.98] transition-all duration-200 shadow-md shadow-green-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
            >
              <span>Request a Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
