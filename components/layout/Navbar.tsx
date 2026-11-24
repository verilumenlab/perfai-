"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const LINKS = [
  { label: "Home", href: "/#", id: "home" },
  { label: "Why PerfAI", href: "/#why-perfai", id: "why-perfai" },
  { label: "Management", href: "/management", id: "management" },
];
const DEMO = { label: "Contact Us", href: "/#demo", id: "demo" };
const SPY_IDS = ["home", "why-perfai", "demo"] as const;

const COLLAPSE_AT = 48;
const EXPAND_AT = 12;

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<(typeof SPY_IDS)[number]>("home");

  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      if (window.scrollY < 120) {
        setActive("home");
        return;
      }
      const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 260);
      let current: (typeof SPY_IDS)[number] = "home";
      for (const id of SPY_IDS) {
        if (id === "home") continue;
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return active;
}

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const onHome = pathname === "/";
  const activeSection = useActiveSection(onHome);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setCollapsed((prev) => (prev ? y > EXPAND_AT : y > COLLAPSE_AT));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(
        drawer.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])"
        ) ?? []
      );
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const pill = collapsed && !reduce;
  const overDarkHero = onHome && !scrolled && !pill;
  const solid = !overDarkHero;

  const isActive = (id: string) => {
    if (id === "management") return pathname === "/management";
    if (!onHome) return false;
    return activeSection === id;
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-0">
      <nav
        aria-label="Primary"
        className={[
          "pointer-events-auto hidden items-center justify-between transition-[width,margin,border-radius,background-color,box-shadow,padding] duration-300 ease-out md:flex",
          pill
            ? "mt-3 h-14 w-[min(720px,calc(100%-2rem))] shrink-0 overflow-visible rounded-full border border-white/10 bg-bg-deep/95 px-5 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            : "mt-0 h-16 w-full rounded-none border-b px-6 lg:px-8",
          !pill && solid ? "border-white/10 bg-bg-deep/95 backdrop-blur-xl" : "",
          !pill && overDarkHero ? "border-transparent bg-transparent" : "",
        ].join(" ")}
      >
        <div className="shrink-0">
          <BrandLogo
            variant="dark"
            size="sm"
            compact
            priority
            testId="navbar-brand"
          />
        </div>

        <ul className="flex items-center gap-0.5">
          {LINKS.map((l) => {
            const active = isActive(l.id);
            return (
              <li key={l.id}>
                <Link
                  href={l.href}
                  aria-current={active ? "true" : undefined}
                  className={[
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                    active
                      ? "text-mint-accent"
                      : "text-white/80 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-1.5">
            <Link
              href={DEMO.href}
              className="inline-flex h-9 items-center rounded-full bg-green-primary px-4 text-sm font-semibold text-bg-deep transition-colors duration-200 hover:bg-mint-accent"
            >
              {DEMO.label}
            </Link>
          </li>
        </ul>
      </nav>

      <div
        className={[
          "pointer-events-auto flex h-14 w-full items-center justify-between px-4 transition-colors duration-300 md:hidden",
          solid
            ? "border-b border-white/10 bg-bg-deep/95 backdrop-blur-xl"
            : "bg-transparent",
        ].join(" ")}
      >
        <BrandLogo
          variant="dark"
          size="sm"
          compact
          priority
          testId="navbar-brand-mobile"
        />
        <button
          ref={menuButton}
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-lg text-white"
        >
          <Menu aria-hidden size={24} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-drawer"
            ref={drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed inset-0 z-50 flex flex-col bg-bg-deep px-6 pt-4 md:hidden"
          >
            <div className="flex h-16 items-center justify-between">
              <BrandLogo variant="dark" size="sm" compact href={null} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-lg text-white"
              >
                <X aria-hidden size={24} />
              </button>
            </div>
            <ul className="mt-6 flex flex-col gap-2">
              {LINKS.map((l) => {
                const active = isActive(l.id);
                return (
                  <li key={l.id}>
                    <Link
                      href={l.href}
                      onClick={close}
                      aria-current={active ? "true" : undefined}
                      className={[
                        "block rounded-xl px-4 py-4 font-heading text-2xl font-bold",
                        active ? "text-mint-accent" : "text-white",
                      ].join(" ")}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href={DEMO.href}
              onClick={close}
              className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-green-primary text-base font-semibold text-bg-deep"
            >
              {DEMO.label}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
