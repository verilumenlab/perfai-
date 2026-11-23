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

/** Fade + rise on first view. Plain children when reduced motion is on. */
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  y = 24,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

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
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
