"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ExternalLink, Mail, UserRound } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { HeroParticleField } from "@/components/three/HeroParticleField";
import { useStableReducedMotion } from "@/components/ui/useStableReducedMotion";
import { managementPage as c } from "@/content/management";

/** Portrait card that tilts in 3D toward the pointer, with depth layers that float above it. */
function TiltPortrait() {
  const reduce = useStableReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 140, damping: 18, mass: 0.5 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      className="relative mx-auto w-full max-w-md lg:mx-0"
      style={{ perspective: 1100 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {/* Glow under the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-green-primary/25 blur-3xl"
      />

      <motion.div
        className="relative"
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/15 bg-bg-surface shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
          style={{ transform: "translateZ(0)" }}
        >
          {c.profile.photoReady ? (
            <Image
              src={c.profile.photo}
              alt={c.profile.photoAlt}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-bg-surface to-bg-deep text-white/40">
              <UserRound aria-hidden className="h-16 w-16" strokeWidth={1.25} />
              <p className="px-6 text-center text-xs leading-relaxed text-white/45">
                Professional photograph placeholder — add{" "}
                <span className="font-mono text-mint-accent/80">public/images/team/manager.jpg</span>
              </p>
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-deep/55 via-transparent to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent"
          />
        </div>

        {/* Floating depth layers */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-3 -top-3 h-14 w-14 rounded-tl-2xl border-l-2 border-t-2 border-mint-accent/70"
          style={{ transform: "translateZ(50px)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-3 -right-3 h-14 w-14 rounded-br-2xl border-b-2 border-r-2 border-mint-accent/70"
          style={{ transform: "translateZ(50px)" }}
        />
        <div
          className="absolute -bottom-4 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-bg-deep/80 px-4 py-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-md"
          style={{ transform: "translateZ(80px)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-accent/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-accent" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/85">
            {c.profile.designation}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={[
        "mb-3 block font-mono text-[10px] uppercase tracking-[0.16em]",
        tone === "dark" ? "text-mint-accent" : "text-forest",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function ManagementPage() {
  return (
    <div className="bg-bg-deep text-white">
      {/* 1. Profile / Hero */}
      <section
        aria-labelledby="management-profile-heading"
        className="relative isolate overflow-hidden border-b border-white/10"
      >
        {/* Layer 3 (back): background image */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ scale: [1.04, 1.12, 1.04] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/management/hero-bg.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[70%_60%]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-bg-deep/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-deep/80 via-bg-deep/35 to-bg-deep/70" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 85% 20%, rgba(35,168,117,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(117,230,174,0.10), transparent 50%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-deep to-transparent" />
        </div>

        {/* Layer 2 (middle): 3D particle animation */}
        <HeroParticleField />

        {/* Layer 1 (top): photo + text */}
        <div className="section-inner relative z-10 grid gap-10 pb-16 pt-28 md:gap-14 md:pb-24 md:pt-36 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <FadeIn>
            <TiltPortrait />
          </FadeIn>

          <FadeIn delay={0.08}>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mint-accent">
              {c.profile.designation}
            </p>
            <h1
              id="management-profile-heading"
              className="mt-3 font-heading text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white"
            >
              {c.profile.fullName}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-base">
              {c.profile.introduction}
            </p>

            <blockquote className="mt-8 max-w-xl border-l-2 border-green-primary/70 pl-5">
              <p className="font-heading text-lg font-bold tracking-tight text-white sm:text-xl">
                {c.quote.title}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                {c.quote.text}
              </p>
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={c.contact.primaryCta.href}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-green-primary px-5 text-sm font-semibold text-bg-deep transition-colors duration-200 hover:bg-mint-accent sm:h-12 sm:px-6"
              >
                {c.contact.primaryCta.label}
                <ArrowRight
                  aria-hidden
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <a
                href={`mailto:${c.contact.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-bg-deep/30 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/45 hover:bg-white/10 sm:h-12 sm:px-6"
              >
                <Mail aria-hidden size={16} />
                Email
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. About the Company */}
      <section
        aria-labelledby="management-company-heading"
        className="section-shell scroll-mt-24 bg-bg-light text-ink"
      >
        <div className="section-inner">
          <FadeIn>
            <Eyebrow>{c.company.eyebrow}</Eyebrow>
            <h2
              id="management-company-heading"
              className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
            >
              {c.company.heading}
            </h2>
          </FadeIn>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              c.company.about,
              c.company.vision,
              c.company.mission,
              c.company.bms,
            ].map((block, i) => (
              <FadeIn key={block.title} delay={i * 0.05}>
                <article className="h-full border-t border-line/80 pt-5">
                  <h3 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                    {block.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
                    {block.text}
                  </p>
                  {"pillars" in block && block.pillars ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {block.pillars.map((pillar) => (
                        <li
                          key={pillar}
                          className="rounded-full border border-line bg-bg-panel px-3 py-1 text-xs font-medium text-ink/80"
                        >
                          {pillar}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.12}>
            <article className="mt-10 rounded-2xl border border-line/80 bg-bg-panel p-6 sm:p-8">
              <h3 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                {c.company.partnership.title}
              </h3>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink/70">
                {c.company.partnership.text}
              </p>
            </article>
          </FadeIn>
        </div>
      </section>

      {/* 3. About the Person */}
      <section
        aria-labelledby="management-person-heading"
        className="section-shell scroll-mt-24 border-t border-line/70 bg-stone text-ink"
      >
        <div className="section-inner grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <FadeIn>
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{c.person.eyebrow}</Eyebrow>
              <h2
                id="management-person-heading"
                className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
              >
                {c.person.heading}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70">
                {c.person.intro}
              </p>
            </div>
          </FadeIn>

          <ol className="divide-y divide-line/80">
            {c.person.responsibilities.map((item, i) => (
              <li key={item.title}>
                <FadeIn delay={i * 0.05}>
                  <div className="grid gap-2 py-7 sm:grid-cols-[3.25rem_1fr] sm:gap-4">
                    <span
                      aria-hidden
                      className="font-heading text-2xl font-extrabold text-green-primary/90"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/70">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Contact & Professional Links */}
      <section
        aria-labelledby="management-contact-heading"
        className="section-shell relative isolate scroll-mt-24 overflow-hidden border-t border-white/10 bg-bg-deep text-white"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/images/management/contact-building.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[75%_50%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-deep/95 via-bg-deep/70 to-bg-deep/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-bg-deep/40" />
        </div>
        <div className="section-inner grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <FadeIn>
            <Eyebrow tone="dark">{c.contact.eyebrow}</Eyebrow>
            <h2
              id="management-contact-heading"
              className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
            >
              {c.contact.heading}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
              {c.contact.text}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-bg-surface/50 px-4 py-3">
                <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-mint-accent" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">
                    Business email
                  </p>
                  <a
                    href={`mailto:${c.contact.email}`}
                    className="mt-0.5 block font-mono text-sm text-white hover:text-mint-accent"
                  >
                    {c.contact.email}
                  </a>
                </div>
              </div>

              {c.contact.linkedIn.ready ? (
                <a
                  href={c.contact.linkedIn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-bg-surface/50 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-mint-accent/40 hover:text-mint-accent"
                >
                  <ExternalLink aria-hidden size={16} />
                  {c.contact.linkedIn.label}
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 bg-bg-surface/30 px-4 py-3 text-sm text-white/45">
                  <ExternalLink aria-hidden size={16} />
                  LinkedIn profile (to be confirmed)
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <Link
              href={c.contact.primaryCta.href}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-green-primary px-7 text-sm font-semibold text-bg-deep transition-colors duration-200 hover:bg-mint-accent"
            >
              {c.contact.primaryCta.label}
              <ArrowRight
                aria-hidden
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
