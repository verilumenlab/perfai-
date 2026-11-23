"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  x: number;
  baseY: number;
  size: number;
  speed: number;
  phase: number;
  amp: number;
  alpha: number;
  tint: 0 | 1;
};

/**
 * Soft green wave-particle field for the footer background.
 * Canvas only — no DOM nodes per particle. Honors reduced motion.
 */
export function FooterWaveParticles() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let t0 = performance.now();

    const COLORS = [
      { r: 35, g: 168, b: 117 }, // green-primary
      { r: 117, g: 230, b: 174 }, // mint-accent
    ] as const;

    function seed() {
      const count = Math.min(110, Math.max(48, Math.floor((w * h) / 14000)));
      particles = Array.from({ length: count }, () => {
        const row = Math.random();
        return {
          x: Math.random() * w,
          baseY: h * (0.35 + row * 0.7),
          size: 1.1 + Math.random() * 2.4,
          speed: 0.18 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          amp: 8 + Math.random() * 22,
          alpha: 0.18 + Math.random() * 0.45,
          tint: Math.random() > 0.55 ? 1 : 0,
        };
      });
    }

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function drawWaveGuides(time: number) {
      const bands = 3;
      for (let b = 0; b < bands; b++) {
        const yBase = h * (0.55 + b * 0.14);
        const amp = 10 + b * 6;
        const color = COLORS[b % 2];
        ctx!.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.008 + time * (0.55 + b * 0.12) + b) * amp +
            Math.sin(x * 0.021 - time * 0.35 + b * 1.4) * (amp * 0.35);
          if (x === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(${color.r},${color.g},${color.b},${0.08 + b * 0.03})`;
        ctx!.lineWidth = 1.25;
        ctx!.stroke();
      }
    }

    function frame(now: number) {
      if (!running) return;
      const t = (now - t0) / 1000;
      ctx!.clearRect(0, 0, w, h);

      // soft vertical wash so particles sit under content
      const wash = ctx!.createLinearGradient(0, 0, 0, h);
      wash.addColorStop(0, "rgba(7,27,23,0)");
      wash.addColorStop(0.45, "rgba(16,44,37,0.15)");
      wash.addColorStop(1, "rgba(35,168,117,0.08)");
      ctx!.fillStyle = wash;
      ctx!.fillRect(0, 0, w, h);

      drawWaveGuides(t);

      for (const p of particles) {
        p.x += p.speed;
        if (p.x > w + 12) p.x = -12;

        const y =
          p.baseY +
          Math.sin(p.x * 0.012 + t * 0.9 + p.phase) * p.amp +
          Math.cos(t * 0.55 + p.phase) * (p.amp * 0.25);

        const c = COLORS[p.tint];
        const pulse = 0.7 + 0.3 * Math.sin(t * 1.4 + p.phase);
        const a = p.alpha * pulse;

        ctx!.beginPath();
        ctx!.arc(p.x, y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
        ctx!.fill();

        // faint trail / glow
        ctx!.beginPath();
        ctx!.arc(p.x, y, p.size * 2.6, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${a * 0.18})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
