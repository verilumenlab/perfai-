"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { MobileNavigation } from "./MobileNavigation";
import { Menu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileScrolled, setIsMobileScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (!isCollapsed && y > 40) {
        setIsCollapsed(true);
      } else if (isCollapsed && y < 10) {
        setIsCollapsed(false);
      }

      setIsMobileScrolled(y > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCollapsed]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Application", href: "/application" },
    { label: "Partner", href: "/partner" },
  ];

  const springTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 260, damping: 30, mass: 1 };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 pointer-events-none flex justify-center w-full">
        <motion.div
          className="hidden md:flex pointer-events-auto items-center justify-between overflow-hidden"
          initial={false}
          animate={{
            width: "100%",
            maxWidth: isCollapsed ? 780 : 1320,
            marginTop: isCollapsed ? 16 : 0,
            height: isCollapsed ? 58 : 80,
            borderRadius: isCollapsed ? 9999 : 0,
            paddingLeft: isCollapsed ? 20 : 36,
            paddingRight: isCollapsed ? 20 : 36,
            backgroundColor: isCollapsed
              ? "rgba(7, 27, 23, 0.92)"
              : isMobileScrolled
              ? "rgba(7, 27, 23, 0.88)"
              : "rgba(7, 27, 23, 0.72)",
            backdropFilter: "blur(20px)",
            borderBottomWidth: 1,
            borderTopWidth: isCollapsed ? 1 : 0,
            borderLeftWidth: isCollapsed ? 1 : 0,
            borderRightWidth: isCollapsed ? 1 : 0,
            borderColor: isCollapsed
              ? "rgba(117, 230, 174, 0.22)"
              : "rgba(220, 232, 224, 0.08)",
            boxShadow: isCollapsed
              ? "0 16px 40px -16px rgba(0, 0, 0, 0.55)"
              : "none",
          }}
          transition={springTransition}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep rounded-full py-1 pr-2 select-none shrink-0"
            data-testid="navbar-brand"
          >
            <div
              aria-hidden="true"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-green-primary to-mint-accent text-bg-deep flex items-center justify-center font-heading font-extrabold text-base sm:text-lg"
            >
              P
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-mint-accent transition-colors">
              PerfAI
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 shrink-0">
            <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep",
                      isActive
                        ? "text-mint-accent font-semibold bg-green-primary/15 border border-green-primary/30"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/#demo"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-green-primary text-bg-deep px-4 py-2 sm:py-2.5 rounded-full hover:bg-mint-accent active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep shrink-0"
            >
              <span>Request a Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        <div
          className={cn(
            "flex md:hidden pointer-events-auto items-center justify-between w-full h-16 px-4 transition-colors duration-200 border-b",
            isMobileScrolled
              ? "bg-bg-deep/95 backdrop-blur-md border-border-dark"
              : "bg-bg-deep/70 backdrop-blur-sm border-white/5"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent rounded-lg p-1"
            data-testid="navbar-brand-mobile"
          >
            <div
              aria-hidden="true"
              className="h-8 w-8 rounded-xl bg-gradient-to-br from-green-primary to-mint-accent text-bg-deep flex items-center justify-center font-heading font-extrabold text-base"
            >
              P
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-white">
              PerfAI
            </span>
          </Link>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 border border-border-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
            aria-label="Open mobile navigation menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="h-16 md:h-20 w-full shrink-0 pointer-events-none" aria-hidden="true" />

      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        triggerRef={triggerRef}
      />
    </>
  );
}
