"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Rise distance; matches reference Reveal `y` */
  y?: number;
}

/**
 * Fade + rise on first view.
 * The starting state is identical on server and client (branching on reduced motion here
 * causes a hydration mismatch). With reduced motion the transition is instant instead.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  y = 24,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const initialVariants = {
    up: { opacity: 0, y },
    down: { opacity: 0, y: -y },
    left: { opacity: 0, x: y },
    right: { opacity: 0, x: -y },
    none: { opacity: 0 },
  };

  return (
    <motion.div
      initial={initialVariants[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
