"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { BuildingPoster } from "@/components/three/BuildingPoster";
import { ArrowRight } from "lucide-react";

const BuildingScene = dynamic(
  () => import("@/components/three/BuildingScene").then((m) => m.BuildingScene),
  {
    ssr: false,
    loading: () => <BuildingPoster variant="hero" />,
  }
);

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.65,
            delay,
            ease: [0.21, 0.47, 0.32, 0.98] as const,
          },
        };

  return (
    <section className="relative w-full h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)] min-h-[560px] flex flex-col overflow-hidden bg-bg-deep">
      {/* Full-bleed layered scene (single canvas, lazy) */}
      <div className="absolute inset-0 z-0">
        <BuildingScene
          mode="scroll"
          variant="hero"
          className="!h-full !max-h-none !min-h-full !aspect-auto !rounded-none !border-0"
        />
      </div>

      {/* Left readable gradient (~48%) */}
      <div
        className="absolute inset-y-0 left-0 z-10 w-full md:w-[52%] pointer-events-none bg-gradient-to-r from-bg-deep via-bg-deep/85 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-32 pointer-events-none bg-gradient-to-t from-bg-deep/80 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-20 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[48%] min-w-[min(100%,20rem)]">
            <motion.div {...rise(0.05)}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-bg-surface/80 border border-green-primary/30 text-mint-accent backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-mint-accent" aria-hidden="true" />
                {siteConfig.resellerBadge}
              </span>
            </motion.div>

            <motion.h1
              className="mt-6 font-heading font-extrabold text-[clamp(1.85rem,4.2vw,3.35rem)] text-white tracking-tight leading-[1.12]"
              {...rise(0.15)}
            >
              Make Your Infrastructure
              <br />
              Smarter. More Efficient.
              <br />
              <span className="text-mint-accent">More Valuable.</span>
            </motion.h1>

            <motion.p
              className="mt-5 text-base sm:text-lg text-text-muted max-w-md leading-relaxed"
              {...rise(0.28)}
            >
              Discover Senatria&apos;s Physical AI platform and solutions, brought to you by PerfAI, your technology partner.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              {...rise(0.4)}
            >
              <Link href="/application">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-green-primary text-bg-deep hover:bg-mint-accent focus-visible:ring-mint-accent focus-visible:ring-offset-bg-deep"
                >
                  <span>Explore the Application</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/#demo">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-bg-surface/80 text-white border-border-dark hover:border-green-primary focus-visible:ring-mint-accent focus-visible:ring-offset-bg-deep"
                >
                  <span>Request a Demo</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
