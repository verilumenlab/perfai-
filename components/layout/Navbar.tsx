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
        className="fixed top-3 sm:top-5 inset-x-0 z-40 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300"
      >
        <div
          className={`pointer-events-auto w-full max-w-[1100px] mx-auto rounded-full transition-all duration-300 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 ${
            scrolled
              ? "bg-bg-deep/90 backdrop-blur-xl border border-green-primary/30 shadow-2xl shadow-black/60 shadow-green-primary/5"
              : "bg-bg-surface/80 backdrop-blur-lg border border-border-dark/80 shadow-xl shadow-black/40"
          }`}
        >
          {/* Brand: PerfAI Logo and Name only */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent rounded-full p-1 transition-all"
            aria-label="PerfAI Homepage"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-green-primary to-mint-accent text-bg-deep flex items-center justify-center font-heading font-extrabold text-base sm:text-lg shadow-md shadow-green-primary/25 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-mint-accent transition-colors">
              PerfAI
            </span>
          </Link>

          {/* Nav links: Home, Application, Partner */}
          <nav
            className="hidden md:flex items-center gap-1 bg-bg-deep/60 px-2 py-1 rounded-full border border-border-dark/60"
            aria-label="Main Navigation"
          >
            <Link
              href="/"
              className="text-xs font-semibold px-4 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/application"
              className="text-xs font-semibold px-4 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Application
            </Link>
            <Link
              href="/partner"
              className="text-xs font-semibold px-4 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Partner
            </Link>
          </nav>

          {/* Right CTA & Mobile hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/#demo"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold bg-green-primary text-bg-deep px-4 py-2 sm:py-2.5 rounded-full hover:bg-mint-accent active:scale-[0.98] transition-all duration-200 shadow-md shadow-green-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
            >
              <span>Request a Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 border border-border-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
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
