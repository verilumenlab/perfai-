"use client";

import { useEffect, useRef } from "react";
import { useStableReducedMotion } from "@/components/ui/useStableReducedMotion";

/**
 * Layer 2 of the Management hero.
 *
 * A canvas particle field in 3D space that loops through four beats:
 *   1. WAVE      – particles flow as a rolling wave surface
 *   2. GATHER    – they spiral in and converge on a single glowing point
 *   3. HOLD      – the point pulses
 *   4. DISTRIBUTE– a burst spreads every particle back across the hero
 *
 * Canvas only (no DOM node per particle), pauses off-screen, reacts to the
 * pointer with a gentle camera parallax, and renders one static frame for
 * visitors who prefer reduced motion.
 */

type Particle = {
  hx: number; // wave home x
  hz: number; // wave home z
  hy: number; // home height offset (small scatter on the wave surface, negative for floating dust)
  vx: number; // own drift speed along x (px/s)
  vz: number; // own drift speed along z (px/s)
  wob: number; // own wobble radius (px)
  size: number;
  phase: number;
  delay: number; // stagger 0..1 (outer particles gather / leave a little later)
  tint: number; // 0 green .. 1 mint
};

const CYCLE = 13; // seconds
const T_GATHER = 5; // wave only until here
const T_HOLD = 7.4; // fully converged from here
const T_BURST = 8.4; // distribute starts
const T_SETTLE = 11; // fully distributed

const GREEN = [35, 168, 117] as const;
const MINT = [117, 230, 174] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);
/** Wraps v into [-range, range) so drifting particles re-enter from the opposite side. */
const wrap = (v: number, range: number) => ((((v + range) % (2 * range)) + 2 * range) % (2 * range)) - range;

/** Global convergence 0..1 for a given point in the cycle (before per-particle stagger). */
function phaseProgress(t: number) {
  if (t < T_GATHER) return { g: 0, mode: "wave" as const, u: 0 };
  if (t < T_HOLD) return { g: (t - T_GATHER) / (T_HOLD - T_GATHER), mode: "gather" as const, u: 0 };
  if (t < T_BURST) return { g: 1, mode: "hold" as const, u: (t - T_HOLD) / (T_BURST - T_HOLD) };
  if (t < T_SETTLE) return { g: 1 - (t - T_BURST) / (T_SETTLE - T_BURST), mode: "burst" as const, u: (t - T_BURST) / (T_SETTLE - T_BURST) };
  return { g: 0, mode: "wave" as const, u: 0 };
}

export function HeroParticleField() {
  const reduce = useStableReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;
    let S = 1; // size scale
    let particles: Particle[] = [];
    const start = performance.now();
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

    function seed() {
      const small = w < 700;
      const count = small ? 230 : 520;
      particles = [];
      // Every particle is independent: its own position, drift speed, wobble and size.
      // Most ride the wave surface; the rest float above it as dust.
      for (let i = 0; i < count; i++) {
        const fx = Math.random() - 0.5;
        const fz = Math.random() - 0.5;
        const onSurface = Math.random() < 0.62;
        const dir = Math.random() < 0.5 ? -1 : 1;
        particles.push({
          hx: fx * w * 1.7,
          hz: fz * w * 1.05,
          hy: onSurface ? (Math.random() - 0.5) * 50 * S : -(70 + Math.random() * 360) * S,
          vx: dir * (8 + Math.random() * 26) * S,
          vz: (Math.random() - 0.5) * 14 * S,
          wob: (6 + Math.random() * 16) * S,
          size: 1.3 + Math.random() * 2.3,
          phase: Math.random() * Math.PI * 2,
          delay: clamp01(Math.hypot(fx * 1.4, fz) * 0.7),
          tint: Math.random(),
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host!.clientWidth;
      h = host!.clientHeight;
      if (!w || !h) return;
      S = Math.min(1.3, Math.max(0.55, w / 1280));
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) draw(2.2);
    }

    function waveY(x: number, z: number, t: number, phase: number) {
      return (
        Math.sin(x * 0.0055 + t * 0.95 + z * 0.0032) * 46 * S +
        Math.sin(x * 0.012 - t * 0.6 + phase * 0.15) * 14 * S +
        Math.cos(z * 0.006 + t * 0.7) * 20 * S
      );
    }

    function draw(time: number) {
      const t = time % CYCLE;
      const { g, mode, u } = phaseProgress(t);
      ctx!.clearRect(0, 0, w, h);

      // Smooth pointer so the camera glides.
      pointer.sx += (pointer.x - pointer.sx) * 0.05;
      pointer.sy += (pointer.y - pointer.sy) * 0.05;

      // Camera: pitch eases toward a flatter view while converged, yaw sways + follows pointer.
      const pitch = 0.5 - 0.14 * easeInOut(g) + pointer.sy * 0.08;
      const yaw = Math.sin(time * 0.25) * 0.16 + pointer.sx * 0.28;
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const F = 820 * S;
      const cx = w * 0.5;
      const cy = h * 0.56;

      const project = (x: number, y: number, z: number): [number, number, number] => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = y * cosP - z1 * sinP;
        const z2 = y * sinP + z1 * cosP;
        const s = F / (F + z2);
        return [cx + x1 * s, cy + y2 * s, s];
      };

      const proj: [number, number, number][] = new Array(particles.length);
      const eArr = new Float32Array(particles.length);

      // Gather uses an accelerating ease; the burst uses a fast-out ease. Outer particles lag slightly.
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let e = 0;
        if (mode === "gather") e = easeInOut(clamp01((g - p.delay * 0.3) / 0.7));
        else if (mode === "hold") e = 1;
        else if (mode === "burst") {
          const local = clamp01((u - (1 - p.delay) * 0.12) / 0.88); // inner particles leave first
          e = 1 - easeOut(local);
        }
        eArr[i] = e;

        // Independent drift (wrapping around the field) plus a personal wobble.
        const rangeX = w * 0.85;
        const rangeZ = w * 0.525;
        const hx = wrap(p.hx + p.vx * time, rangeX) + Math.sin(time * 0.8 + p.phase) * p.wob;
        const hz = wrap(p.hz + p.vz * time, rangeZ) + Math.cos(time * 0.65 + p.phase * 1.3) * p.wob;
        const wy =
          waveY(hx, hz, time, p.phase) * (p.hy < -70 * S ? 0.55 : 1) +
          p.hy +
          Math.sin(time * 1.1 + p.phase * 2) * p.wob * 0.6;
        let x = hx;
        let y = wy;
        let z = hz;

        if (e > 0) {
          // Spiral around the focal axis while shrinking toward it.
          const ang = e * 2.4;
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          const k = 1 - e;
          const rx = (hx * ca - hz * sa) * k;
          const rz = (hx * sa + hz * ca) * k;
          // Tiny residual ring so the core has body, plus a breathing shake while held.
          const ring = (6 + 10 * Math.sin(time * 4 + p.phase) * (mode === "hold" ? 0.6 : 0.2)) * S * e;
          x = rx + Math.cos(p.phase) * ring;
          z = rz + Math.sin(p.phase) * ring;
          y = wy * k + Math.sin(p.phase * 2) * ring * 0.8 - 14 * S * e;
        }

        proj[i] = project(x, y, z);
      }

      // Focal point (screen position of the world origin).
      const [fx, fy, fs] = project(0, -14 * S, 0);

      // Soft core glow while converged.
      const core = easeInOut(g);
      if (core > 0.01) {
        const pulse = 1 + (mode === "hold" ? 0.12 * Math.sin(time * 9) : 0);
        const rad = (26 + 120 * core) * S * fs * pulse;
        const grad = ctx!.createRadialGradient(fx, fy, 0, fx, fy, rad);
        grad.addColorStop(0, `rgba(255,255,255,${0.85 * core})`);
        grad.addColorStop(0.18, `rgba(${MINT[0]},${MINT[1]},${MINT[2]},${0.55 * core})`);
        grad.addColorStop(0.55, `rgba(${GREEN[0]},${GREEN[1]},${GREEN[2]},${0.18 * core})`);
        grad.addColorStop(1, "rgba(35,168,117,0)");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(fx, fy, rad, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Shock rings sweeping outward as the particles are distributed.
      if (mode === "burst") {
        for (let ring = 0; ring < 2; ring++) {
          const ru = clamp01(u * 1.25 - ring * 0.18);
          if (ru <= 0 || ru >= 1) continue;
          const radius = easeOut(ru) * w * 0.55;
          ctx!.beginPath();
          for (let a = 0; a <= 64; a++) {
            const th = (a / 64) * Math.PI * 2;
            const [px, py] = project(Math.cos(th) * radius, -14 * S, Math.sin(th) * radius);
            if (a === 0) ctx!.moveTo(px, py);
            else ctx!.lineTo(px, py);
          }
          ctx!.strokeStyle = `rgba(${MINT[0]},${MINT[1]},${MINT[2]},${0.32 * (1 - ru)})`;
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }
      }

      // Particles (additive so overlaps glow).
      ctx!.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const [sx, sy, s] = proj[i];
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;
        const e = eArr[i];
        const depth = clamp01((s - 0.55) / 0.9);
        const twinkle = 0.75 + 0.25 * Math.sin(time * 1.6 + p.phase);
        // Brighter while travelling, softer once stacked in the core (the glow carries it).
        const travel = 1 + 1.1 * Math.sin(Math.PI * e);
        const a = (0.4 + 0.55 * depth) * twinkle * travel * (1 - 0.55 * e * e);
        const mix = clamp01(p.tint * 0.8 + e * 0.5);
        const r = Math.round(GREEN[0] + (MINT[0] - GREEN[0]) * mix);
        const gg = Math.round(GREEN[1] + (MINT[1] - GREEN[1]) * mix);
        const b = Math.round(GREEN[2] + (MINT[2] - GREEN[2]) * mix);
        const radius = p.size * Math.min(s, 1.25) * (1 - 0.35 * e) * (S > 1 ? 1 : 0.9);

        ctx!.fillStyle = `rgba(${r},${gg},${b},${Math.min(1, a)})`;
        ctx!.beginPath();
        ctx!.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = `rgba(${r},${gg},${b},${Math.min(1, a) * 0.2})`;
        ctx!.beginPath();
        ctx!.arc(sx, sy, radius * 3.4, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (!visible || !w) return;
      draw((now - start) / 1000);
    }

    function onPointer(e: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      pointer.x = clamp01((e.clientX - rect.left) / rect.width) - 0.5;
      pointer.y = clamp01((e.clientY - rect.top) / rect.height) - 0.5;
    }
    function onLeave() {
      pointer.x = 0;
      pointer.y = 0;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let io: IntersectionObserver | undefined;
    if (!reduce) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);
      host.addEventListener("pointermove", onPointer);
      host.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}
