"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BeachfrontHeroVisual } from "@/components/three/BeachfrontHeroVisual";
import { hero } from "@/content/home";

/** One-screen hero — no tall sticky pin (avoids empty scroll / overlap feel). */
export function HeroSection() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak =
      (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) < 4;
    setLite(small || weak);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-heading"
      className="relative h-[100svh] min-h-[560px] overflow-hidden"
    >
      <BeachfrontHeroVisual
        progress={scrollYProgress}
        reduce={reduce}
        lite={lite}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-6 pt-16 md:pt-20">
        <div className="w-full max-w-xl md:w-[48%] md:max-w-none">
          <h1
            id="hero-heading"
            className="font-heading text-[clamp(2rem,4.8vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white"
          >
            {hero.lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.1 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={[
                    "block",
                    i === hero.accentLineIndex ? "text-mint-accent" : "",
                  ].join(" ")}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-5 max-w-[30rem] text-[15px] leading-relaxed text-white/75 sm:text-base"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Link
              href={hero.primary.href}
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-green-primary px-5 text-sm font-semibold text-bg-deep transition-colors duration-200 hover:bg-mint-accent sm:h-12 sm:px-6"
            >
              {hero.primary.label}
              <ArrowRight
                aria-hidden
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={hero.secondary.href}
              className="inline-flex h-11 items-center rounded-full border border-white/25 bg-bg-deep/30 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/45 hover:bg-white/10 sm:h-12 sm:px-6"
            >
              {hero.secondary.label}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
