"use client";

import React, { useRef } from "react";
import { useStableReducedMotion } from "@/components/ui/useStableReducedMotion";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Building2,
  Cctv,
  Cloud,
  Fan,
  Mail,
  MapPin,
  Phone,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { FooterWaveParticles } from "@/components/layout/FooterWaveParticles";

const spring = { stiffness: 120, damping: 18, mass: 0.4 };

const FLOATING_ICONS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Building2, label: "Buildings" },
  { Icon: Fan, label: "HVAC" },
  { Icon: Zap, label: "Energy" },
  { Icon: Cctv, label: "Monitoring" },
  { Icon: Cloud, label: "Cloud control" },
];

const SERVICES = [
  "HVAC Management",
  "Energy Monitoring",
  "BMS Integration",
  "Facility Operations",
];

function FloatingChip({
  Icon,
  label,
  index,
  reduce,
}: {
  Icon: LucideIcon;
  label: string;
  index: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      title={label}
      aria-hidden
      className="grid h-11 w-11 place-items-center rounded-xl border border-mint-accent/35 bg-bg-deep/60 text-mint-accent shadow-[0_0_26px_-6px_rgba(117,230,174,0.65)] backdrop-blur-md"
      style={{
        transformStyle: "preserve-3d",
        translateZ: 24 + index * 6,
        marginTop: index % 2 === 0 ? 0 : 14,
      }}
      animate={
        reduce
          ? undefined
          : { y: [0, -8, 0], rotateY: [0, 18, 0, -18, 0], rotateX: [0, 8, 0] }
      }
      transition={{ duration: 5.5 + index * 0.7, repeat: Infinity, ease: "easeInOut" }}
      whileHover={reduce ? undefined : { scale: 1.14 }}
    >
      <Icon size={20} strokeWidth={1.6} />
    </motion.div>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-4 flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-white">
      <span aria-hidden className="h-px w-5 bg-green-primary" />
      {children}
    </h4>
  );
}

function ContactRow({
  Icon,
  label,
  children,
}: {
  Icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/5 text-mint-accent">
        <Icon aria-hidden size={15} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] uppercase tracking-[0.14em] text-white/45">
          {label}
        </span>
        <span className="mt-0.5 block text-sm text-white/90">{children}</span>
      </span>
    </li>
  );
}

export function Footer() {
  const reduce = useStableReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-white/10 bg-bg-deep text-white/70">
      {/* Photo backdrop: building visible on the right, dark wash on the left */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/footer/footer-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[right_center] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-bg-deep/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-bg-deep/50" />
      </div>

      <FooterWaveParticles />

      {/* Animated top hairline */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-mint-accent/70 to-transparent"
        animate={reduce ? undefined : { opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-8 z-[1] h-56 w-56 rounded-full bg-green-primary/25 blur-3xl"
        animate={reduce ? undefined : { y: [0, 18, 0], x: [0, 10, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        {/* CTA panel with floating 3D icons */}
        <div style={{ perspective: 1200 }}>
          <motion.div
            ref={panelRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/15 bg-bg-deep/55 px-6 py-6 shadow-[0_28px_70px_-36px_rgba(0,0,0,0.9)] backdrop-blur-md sm:px-8 lg:flex-row lg:items-center lg:justify-between"
            style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            <div className="max-w-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mint-accent">
                Let&apos;s talk
              </p>
              <h3 className="mt-2 font-heading text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
                Make your building smarter and better managed.
              </h3>
            </div>

            <div className="hidden items-start gap-3 lg:flex" aria-hidden>
              {FLOATING_ICONS.map(({ Icon, label }, i) => (
                <FloatingChip key={label} Icon={Icon} label={label} index={i} reduce={reduce} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#demo"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-green-primary px-5 text-sm font-semibold text-bg-deep transition-colors duration-200 hover:bg-mint-accent"
              >
                Contact Us
                <ArrowRight
                  aria-hidden
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-bg-deep/40 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:border-white/45 hover:bg-white/10"
              >
                <Phone aria-hidden size={15} />
                {siteConfig.contact.phone}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Link grid */}
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <BrandLogo variant="dark" size="sm" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted">
              PerfAI is a channel partner for building management services —
              helping commercial buildings and facilities adopt BMS solutions that
              fit real operations.
            </p>
          </div>

          <div className="lg:col-span-2">
            <ColumnTitle>Navigation</ColumnTitle>
            <ul className="flex flex-col gap-2.5 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "inline-block transition-all duration-200 hover:translate-x-1",
                      item.href === "/#demo"
                        ? "text-mint-accent hover:underline"
                        : "text-text-muted hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <ColumnTitle>Services</ColumnTitle>
            <ul className="flex flex-col gap-2.5 text-sm text-text-muted">
              {SERVICES.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-green-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <ColumnTitle>Business Contact</ColumnTitle>
            <ul className="grid gap-4 sm:grid-cols-2">
              <ContactRow Icon={UserRound} label="Contact">
                {siteConfig.contact.name}
              </ContactRow>
              <ContactRow Icon={Mail} label="Email">
                <a
                  href={`mailto:${siteConfig.contact.salesEmail}`}
                  className="break-all font-mono text-[13px] hover:text-mint-accent"
                >
                  {siteConfig.contact.salesEmail}
                </a>
              </ContactRow>
              <ContactRow Icon={Phone} label="Phone">
                <a
                  href={siteConfig.contact.phoneHref}
                  className="font-mono text-[13px] hover:text-mint-accent"
                >
                  {siteConfig.contact.phone}
                </a>
              </ContactRow>
              <ContactRow Icon={MapPin} label="Office">
                <span className="text-[13px] text-white/80">
                  {[siteConfig.contact.address.line1, siteConfig.contact.address.city]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </ContactRow>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-text-muted sm:flex-row">
          <p>© 2026 PerfAI. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
