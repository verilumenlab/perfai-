"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BadgeDollarSign,
  GraduationCap,
  Wrench,
  Briefcase,
  Megaphone,
  Headphones,
  MousePointer2,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { useStableReducedMotion } from "@/components/ui/useStableReducedMotion";
import { BenefitsBuilding3D } from "@/components/three/BenefitsBuilding3D";
import { partnerBenefits } from "@/content/home";

const icons: Record<string, LucideIcon> = {
  margins: BadgeDollarSign,
  training: GraduationCap,
  presales: Wrench,
  demo: Briefcase,
  marketing: Megaphone,
  support: Headphones,
};

const CARD_H = 132;
const ROW_GAP = 28;
const TOP_PAD = 16;
const STAGE_H = TOP_PAD + 3 * CARD_H + 2 * ROW_GAP + 56;
const CYCLE_MS = 4500;

/** Arc layout (desktop), left to right. fx = card centre as a fraction of stage width; row 0 is the top. */
const ARC: { key: string; fx: number; row: number; ry: number }[] = [
  { key: "demo", fx: 0.09, row: 2, ry: 20 },
  { key: "margins", fx: 0.24, row: 1, ry: 12 },
  { key: "training", fx: 0.395, row: 0, ry: 5 },
  { key: "presales", fx: 0.605, row: 0, ry: -5 },
  { key: "marketing", fx: 0.76, row: 1, ry: -12 },
  { key: "support", fx: 0.91, row: 2, ry: -20 },
];

const benefits = ARC.map((cfg) => ({
  cfg,
  item: partnerBenefits.items.find((it) => it.key === cfg.key)!,
  Icon: icons[cfg.key],
})).filter((b) => b.item && b.Icon);

/** Rows sit in separate vertical bands, so cards can never overlap at any width. */
function useArcLayout(width: number) {
  return useMemo(() => {
    const cardW = Math.round(Math.min(196, Math.max(164, width * 0.165)));
    const edge = cardW / 2 + 10;
    const cards = benefits.map(({ cfg }) => ({
      x: Math.min(width - edge, Math.max(edge, cfg.fx * width)),
      top: TOP_PAD + cfg.row * (CARD_H + ROW_GAP),
    }));
    const buildingW = Math.min(700, width * 0.62);
    return { cardW, cards, buildingW, buildingH: (buildingW * 470) / 700 };
  }, [width]);
}

type Pt = [number, number];

/** Smooth Catmull-Rom spline through points, returned as a cubic Bézier path + segment midpoints. */
function spline(points: Pt[]) {
  const p = [points[0], ...points, points[points.length - 1]];
  let d = `M ${points[0][0]} ${points[0][1]}`;
  const mids: Pt[] = [];
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    const [x3, y3] = p[i + 2];
    const c1: Pt = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6];
    const c2: Pt = [x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${x2} ${y2}`;
    mids.push([
      (x1 + 3 * c1[0] + 3 * c2[0] + x2) / 8,
      (y1 + 3 * c1[1] + 3 * c2[1] + y2) / 8,
    ]);
  }
  return { d, mids };
}

function Connector({
  width,
  cards,
  reduce,
}: {
  width: number;
  cards: { x: number; top: number }[];
  reduce: boolean | null;
}) {
  const { d, mids } = useMemo(() => {
    const pts: Pt[] = [
      [width * 0.01, STAGE_H - 24],
      ...cards.map((c) => [c.x, c.top + CARD_H / 2] as Pt),
      [width * 0.99, STAGE_H - 24],
    ];
    return spline(pts);
  }, [width, cards]);

  // Nodes sit between cards (skip the lead-in/out segments).
  const nodes = mids.slice(1, -1);

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${width} ${STAGE_H}`}
    >
      <defs>
        <linearGradient id="benefit-flow" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#23A875" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#23A875" stopOpacity="1" />
          <stop offset="1" stopColor="#23A875" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="benefit-pulse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#75E6AE" />
          <stop offset="1" stopColor="#75E6AE" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.path
        d={d}
        fill="none"
        stroke="#23A875"
        strokeOpacity="0.28"
        strokeWidth="10"
        style={{ filter: "blur(8px)" }}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 2.2, ease: "easeInOut" }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="url(#benefit-flow)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 2.2, ease: "easeInOut" }}
      />

      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#23A875" opacity="0.18" />
          <circle cx={x} cy={y} r="4.5" fill="#ffffff" stroke="#23A875" strokeWidth="2" />
        </g>
      ))}

      {!reduce &&
        [0, 3].map((begin) => (
          <circle key={begin} r="7" fill="url(#benefit-pulse)">
            <animateMotion dur="6s" begin={`${begin}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}
    </svg>
  );
}

function BenefitCard({
  index,
  active,
  cardW,
  pos,
  reduce,
  onActivate,
}: {
  index: number;
  active: boolean;
  cardW: number;
  pos: { x: number; top: number };
  reduce: boolean | null;
  onActivate: () => void;
}) {
  const { cfg, item, Icon } = benefits[index];

  return (
    <li
      className="absolute"
      style={{
        width: cardW,
        left: pos.x - cardW / 2,
        top: pos.top,
        zIndex: active ? 20 : 10,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: reduce ? 0 : 0.7,
          delay: reduce ? 0 : 0.25 + index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.45 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.button
            type="button"
            onMouseEnter={onActivate}
            onFocus={onActivate}
            onClick={onActivate}
            aria-pressed={active}
            aria-label={item.title}
            className={`block w-full rounded-[18px] p-px text-left outline-none transition-[background,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-mint-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stone ${
              active
                ? "bg-gradient-to-br from-white via-mint-accent to-green-primary shadow-[0_0_0_4px_rgba(117,230,174,0.28),0_40px_80px_-28px_rgba(15,92,69,0.9)]"
                : "bg-gradient-to-br from-white/70 via-mint-accent/40 to-forest/70 shadow-[0_28px_56px_-26px_rgba(15,92,69,0.65)]"
            }`}
            style={{ transformStyle: "preserve-3d" }}
            initial={false}
            animate={
              reduce
                ? undefined
                : { rotateY: active ? 0 : cfg.ry, z: active ? 70 : 30, scale: active ? 1.04 : 1 }
            }
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
          >
            <span
              className="relative flex flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[17px] bg-gradient-to-br from-[#22b07b] via-[#178a61] to-[#0c4f3b] px-3.5 text-center text-white"
              style={{ height: CARD_H }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"
              />
              <span
                aria-hidden
                className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300 ${
                  active ? "bg-mint-accent/45" : "bg-mint-accent/20"
                }`}
              />
              <span className="absolute left-3.5 top-3 font-mono text-[10px] tracking-wider text-white/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/30 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="relative block text-balance font-heading text-[14.5px] font-bold leading-[1.25] tracking-tight">
                {item.title}
              </span>
              <span
                aria-hidden
                className={`relative h-[3px] rounded-full bg-mint-accent transition-all duration-300 ${
                  active ? "w-14" : "w-8"
                }`}
              />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </li>
  );
}

function DetailPanel({
  active,
  playing,
  reduce,
  onSelect,
}: {
  active: number;
  playing: boolean;
  reduce: boolean | null;
  onSelect: (i: number) => void;
}) {
  const { item, Icon } = benefits[active];

  return (
    <div className="relative z-30 mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_30px_60px_-30px_rgba(12,22,18,0.45)] backdrop-blur-md">
      <div className="flex items-center gap-5 p-4 pr-5">
        <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#22b07b] to-[#0c4f3b] text-white shadow-[0_12px_24px_-12px_rgba(15,92,69,0.8)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active}
              initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.6, rotate: 20 }}
              transition={{ duration: 0.25 }}
            >
              <Icon aria-hidden className="h-6 w-6" strokeWidth={1.75} />
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="min-w-0 flex-1" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-green-primary">
                Benefit {String(active + 1).padStart(2, "0")} / {String(benefits.length).padStart(2, "0")}
              </p>
              <h3 className="mt-0.5 font-heading text-lg font-bold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-0.5 text-sm leading-relaxed text-ink/70">{item.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-1.5" role="tablist" aria-label="Partner benefits">
          {benefits.map((b, i) => (
            <button
              key={b.cfg.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={b.item.title}
              onClick={() => onSelect(i)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-primary ${
                i === active ? "w-6 bg-green-primary" : "w-2 bg-ink/15 hover:bg-ink/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="h-[3px] w-full bg-ink/5">
        {playing && !reduce && (
          <motion.div
            key={active}
            className="h-full bg-gradient-to-r from-green-primary to-mint-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}

function ArcStage({ reduce }: { reduce: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1152);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const inView = useInView(ref, { amount: 0.4 });
  const playing = inView && !hovering && !reduce;
  const { cardW, cards, buildingW, buildingH } = useArcLayout(width);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % benefits.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [playing, active]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <div
      className="hidden lg:block"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        mx.set(0);
        my.set(0);
      }}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        className="relative mt-10"
        style={{ height: STAGE_H, perspective: 1600 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[460px]"
          style={{
            background:
              "radial-gradient(ellipse 40% 55% at 50% 72%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%), radial-gradient(ellipse 34% 30% at 50% 88%, rgba(35,168,117,0.22), rgba(35,168,117,0) 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10%] bottom-[-60px] h-[300px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,92,69,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,92,69,0.10) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            transform: "perspective(700px) rotateX(68deg)",
            transformOrigin: "center top",
            maskImage: "radial-gradient(ellipse 50% 70% at 50% 20%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 50% 70% at 50% 20%, black, transparent 75%)",
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              width: buildingW,
              height: buildingH,
              left: width / 2 - buildingW / 2,
              bottom: -40 * (buildingW / 700),
            }}
          >
            <BenefitsBuilding3D reduce={reduce} />
          </div>

          <Connector width={width} cards={cards} reduce={reduce} />

          <ul className="m-0 list-none p-0" style={{ transformStyle: "preserve-3d" }}>
            {benefits.map((b, i) => (
              <BenefitCard
                key={b.cfg.key}
                index={i}
                active={i === active}
                cardW={cardW}
                pos={cards[i]}
                reduce={reduce}
                onActivate={() => setActive(i)}
              />
            ))}
          </ul>
        </motion.div>
      </div>

      <DetailPanel active={active} playing={playing} reduce={reduce} onSelect={setActive} />
    </div>
  );
}

function Heading() {
  const words = partnerBenefits.heading.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");
  return (
    <h2 className="text-balance font-heading text-[clamp(1.9rem,3.8vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-ink">
      {head}{" "}
      <span className="bg-gradient-to-r from-green-primary to-forest bg-clip-text text-transparent">
        {tail}
      </span>
    </h2>
  );
}

export function PartnerBenefitsSection() {
  const reduce = useStableReducedMotion();

  return (
    <section
      id="partner-benefits"
      className="section-shell relative scroll-mt-24 overflow-hidden border-y border-line/70 bg-gradient-to-b from-[#eef3f0] via-stone to-[#e8eeea] text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-mint-accent/15 blur-3xl"
      />

      <div className="section-inner relative">
        <FadeIn>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-green-primary/25 bg-white/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-forest backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-green-primary" />
                Partner benefits
              </span>
              <div className="mt-4">
                <Heading />
              </div>
              <span aria-hidden className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-green-primary to-mint-accent" />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
                {partnerBenefits.text}
              </p>
            </div>
            <p className="hidden shrink-0 items-center gap-2 rounded-full border border-line bg-white/60 px-3 py-1.5 text-xs font-medium text-ink/60 backdrop-blur lg:flex">
              <MousePointer2 aria-hidden className="h-3.5 w-3.5 text-green-primary" />
              Hover a benefit to explore
            </p>
          </div>
        </FadeIn>

        <ArcStage reduce={reduce} />

        {/* Tablet / mobile */}
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden" style={{ perspective: 1000 }}>
          {benefits.map(({ cfg, item, Icon }, i) => (
            <li key={cfg.key}>
              <FadeIn delay={(i % 2) * 0.05}>
                <motion.article
                  className="relative h-full overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-[#22b07b] via-[#178a61] to-[#0c4f3b] p-5 text-white shadow-[0_22px_44px_-22px_rgba(15,92,69,0.75)]"
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={reduce ? undefined : { y: -6, rotateX: 5, rotateY: -5 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent" />
                  <span className="absolute right-4 top-4 font-mono text-[10px] tracking-wider text-white/55">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative mb-3 grid h-10 w-10 place-items-center rounded-xl border border-white/30 bg-white/15">
                    <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="relative pr-8 font-heading text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/85">{item.text}</p>
                </motion.article>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
