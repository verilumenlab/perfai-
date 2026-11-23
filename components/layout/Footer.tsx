"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { FooterWaveParticles } from "@/components/layout/FooterWaveParticles";

const spring = { stiffness: 120, damping: 18, mass: 0.4 };

function FooterColumn({
  children,
  depth = 0,
  className = "",
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`relative transform-gpu ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      whileHover={
        reduce
          ? undefined
          : {
              z: depth + 28,
              transition: { type: "spring", ...spring },
            }
      }
      initial={false}
      animate={reduce ? undefined : { z: depth }}
    >
      <div className="relative h-full rounded-xl border border-white/[0.06] bg-bg-surface/35 p-5 backdrop-blur-[2px]">
        {children}
      </div>
    </motion.div>
  );
}

export function Footer() {
  const reduce = useReducedMotion();
  const sceneRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);

  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const glareX = useTransform(sx, [-0.5, 0.5], [20, 80]);
  const glareY = useTransform(sy, [-0.5, 0.5], [15, 75]);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, rgba(117,230,174,0.14), transparent 55%)`;

  const slabARotateX = useTransform(sy, [-0.5, 0.5], [18, 8]);
  const slabARotateY = useTransform(sx, [-0.5, 0.5], [-22, -8]);
  const slabBRotateX = useTransform(sy, [-0.5, 0.5], [10, 20]);
  const slabBRotateY = useTransform(sx, [-0.5, 0.5], [8, 24]);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <footer
      ref={sceneRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate w-full overflow-hidden border-t border-white/10 bg-bg-deep pt-14 pb-10 text-white/70"
    >
      <FooterWaveParticles />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}
      >
        <div
          className="absolute inset-[-20%] opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(117,230,174,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(117,230,174,0.07) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            transform: "rotateX(62deg) translateY(18%) scale(1.35)",
            transformOrigin: "center top",
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 70%, transparent)",
          }}
        />
        <motion.div
          className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-green-primary/20 blur-3xl"
          animate={
            reduce
              ? undefined
              : { y: [0, 18, 0], x: [0, 10, 0], opacity: [0.35, 0.55, 0.35] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-mint-accent/15 blur-3xl"
          animate={
            reduce
              ? undefined
              : { y: [0, -22, 0], x: [0, -12, 0], opacity: [0.25, 0.45, 0.25] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {!reduce && (
          <>
            <motion.div
              className="absolute left-[12%] top-[28%] h-24 w-36 rounded-xl border border-mint-accent/15 bg-bg-surface/30"
              style={{
                rotateX: slabARotateX,
                rotateY: slabARotateY,
                translateZ: 40,
              }}
            />
            <motion.div
              className="absolute right-[10%] top-[18%] h-20 w-28 rounded-xl border border-green-primary/20 bg-green-primary/10"
              style={{
                rotateX: slabBRotateX,
                rotateY: slabBRotateY,
                translateZ: 60,
              }}
            />
          </>
        )}
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-80"
        style={{ background: glare }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-4 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-4"
          style={
            reduce
              ? undefined
              : {
                  perspective: 1200,
                  transformStyle: "preserve-3d",
                  rotateX,
                  rotateY,
                }
          }
        >
          <FooterColumn depth={12}>
            <div className="flex flex-col gap-4">
              <BrandLogo variant="dark" size="sm" />
              <p className="max-w-sm text-sm leading-relaxed text-text-muted">
                PerfAI is a channel partner for building management services —
                helping commercial buildings and facilities adopt BMS solutions that
                fit real operations.
              </p>
            </div>
          </FooterColumn>

          <FooterColumn depth={24}>
            <div className="flex flex-col gap-3">
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
                Navigation
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-text-muted">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={[
                        "transition-colors hover:text-white",
                        item.href === "/#demo"
                          ? "text-mint-accent hover:underline"
                          : "",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FooterColumn>

          <FooterColumn depth={36}>
            <div className="flex flex-col gap-3">
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
                Services
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-text-muted">
                <li>
                  <span className="text-white/70">HVAC Management</span>
                </li>
                <li>
                  <span className="text-white/70">Energy Monitoring</span>
                </li>
                <li>
                  <span className="text-white/70">BMS Integration</span>
                </li>
                <li>
                  <span className="text-white/70">Facility Operations</span>
                </li>
              </ul>
            </div>
          </FooterColumn>

          <FooterColumn depth={48}>
            <div className="flex flex-col gap-3">
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
                Business Contact
              </h4>
              <div className="flex flex-col gap-2 text-xs text-text-muted">
                <p>
                  <span className="block text-white/60">Inquiries:</span>
                  <span className="font-mono text-white">
                    {siteConfig.contact.salesEmail}
                  </span>
                </p>
                <p>
                  <span className="block text-white/60">Phone:</span>
                  <span className="font-mono text-white">
                    {siteConfig.contact.phone}
                  </span>
                </p>
                <p>
                  <span className="block text-white/60">Office:</span>
                  <span>
                    {siteConfig.contact.address.line1},{" "}
                    {siteConfig.contact.address.city}
                  </span>
                </p>
              </div>
            </div>
          </FooterColumn>
        </motion.div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-text-muted sm:flex-row">
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
