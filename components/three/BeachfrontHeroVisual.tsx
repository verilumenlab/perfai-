"use client";

import { useEffect, useRef } from "react";
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
 * Full-bleed hero background video with quiet scroll push-in.
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Some browsers (e.g. iOS low-power mode, strict autoplay settings) ignore the autoplay
  // attribute. Call play() ourselves and retry once the tab becomes visible again.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => {
      if (video.paused) void video.play().catch(() => {});
    };
    tryPlay();
    document.addEventListener("visibilitychange", tryPlay);
    return () => document.removeEventListener("visibilitychange", tryPlay);
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#071B17] ${className ?? ""}`}
      role="img"
      aria-label="Building management background"
    >
      <motion.div
        style={{ scale, x }}
        className="absolute inset-[-4%] will-change-transform"
      >
        {/*
          The source footage carries a small logo watermark in its bottom-right corner.
          Oversizing the video from the top-left pushes that corner outside the visible hero
          (the section clips overflow), at every viewport size.
        */}
        {/*
          The video always plays: it is muted and looping, so it is background texture rather
          than a distracting animation. "Reduce motion" still stops the camera push-in below.
        */}
        <video
          ref={videoRef}
          className="absolute left-0 top-0 h-[124%] w-[124%] max-w-none object-cover object-[78%_42%]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Subtle warm deepen on scroll */}
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

      {/* Soft left wash for copy — keeps the media continuous */}
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
