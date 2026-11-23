"use client";

import Image from "next/image";
import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

type SceneProps = {
  progress: MotionValue<number>;
  reduce: boolean;
  lite: boolean;
  className?: string;
};

/**
 * Full-bleed photoreal beachfront plate with quiet scroll push-in.
 * No layered cutouts / floating product chips — the photo carries the scene.
 */
export function BeachfrontHeroVisual({
  progress,
  reduce,
  lite,
  className,
}: SceneProps) {
  const scale = useTransform(progress, [0, 1], [1.04, reduce || lite ? 1.04 : 1.12]);
  const x = useTransform(progress, [0, 1], ["0%", reduce || lite ? "0%" : "-2.5%"]);
  const warm = useTransform(progress, [0, 1], [0.08, reduce ? 0.08 : 0.22]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#071B17] ${className ?? ""}`}
      role="img"
      aria-label="Modern glass building on a tropical beach at sunset"
    >
      <motion.div
        style={{ scale, x }}
        className="absolute inset-[-4%] will-change-transform"
      >
        <Image
          src="/images/hero/hero-beachfront.webp"
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover object-[78%_42%]"
        />
      </motion.div>

      {/* Subtle sunset deepen on scroll */}
      <motion.div
        style={{ opacity: warm }}
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 45%, rgba(255,180,100,0.55), transparent 55%)",
          }}
        />
      </motion.div>

      {/* Soft left wash for copy — keeps the photo continuous */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-[52%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(7,27,23,0.72) 0%, rgba(7,27,23,0.4) 55%, rgba(7,27,23,0.08) 82%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{
          background:
            "linear-gradient(to top, rgba(7,27,23,0.5), transparent)",
        }}
        aria-hidden
      />
    </div>
  );
}
