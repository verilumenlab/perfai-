"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { X, ArrowRight } from "lucide-react";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileNavigation({
  isOpen,
  onClose,
  triggerRef,
}: MobileNavigationProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return;

    const triggerNode = triggerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
      triggerNode?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 md:hidden"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-bg-deep border-l border-border-dark p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-border-dark">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className="h-8 w-8 rounded-xl bg-gradient-to-br from-green-primary to-mint-accent text-bg-deep flex items-center justify-center font-heading font-extrabold text-base"
              >
                P
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                PerfAI
              </span>
            </Link>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 border border-border-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 mt-6" aria-label="Mobile Navigation Links">
            {[
              { label: "Home", href: "/" },
              { label: "Application", href: "/application" },
              { label: "Partner", href: "/partner" },
            ].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    isActive
                      ? "text-mint-accent bg-bg-surface border border-green-primary/30 font-semibold"
                      : "text-white/90 hover:text-white hover:bg-bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-border-dark flex flex-col gap-3">
          <Link
            href="/#demo"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-green-primary text-bg-deep font-semibold text-center hover:bg-mint-accent transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
          >
            <span>Request a Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-text-muted text-center">
            {siteConfig.partnershipTagline}
          </p>
        </div>
      </div>
    </div>
  );
}
