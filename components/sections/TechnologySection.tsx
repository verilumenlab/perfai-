import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { technology } from "@/content/home";

/** Six-node ring showing the BMS operating cycle. Pure SVG, no client JS. */
function LoopDiagram() {
  const size = 360;
  const c = size / 2;
  const r = 128;
  const nodes = technology.loop.map((label, i) => {
    const a = (-90 + i * 60) * (Math.PI / 180);
    return { label, x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
  });
  return (
    <svg
      role="img"
      aria-label={`Building management cycle: ${technology.loop.join(", then ")}, and back to the start`}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto h-auto w-full max-w-[380px]"
    >
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="var(--line)"
        strokeWidth="2"
        strokeDasharray="4 8"
      />
      <circle cx={c} cy={c} r={58} fill="var(--bg-deep)" />
      <text
        x={c}
        y={c + 6}
        textAnchor="middle"
        className="fill-white font-heading text-[18px] font-extrabold"
      >
        {technology.loopCenter}
      </text>
      {nodes.map((n, i) => (
        <g key={n.label}>
          <circle
            cx={n.x}
            cy={n.y}
            r={30}
            fill="white"
            stroke="var(--green-primary)"
            strokeWidth="2"
          />
          <text
            x={n.x}
            y={n.y - 4}
            textAnchor="middle"
            className="fill-ink-muted text-[9px] font-semibold"
          >
            {String(i + 1).padStart(2, "0")}
          </text>
          <text
            x={n.x}
            y={n.y + 10}
            textAnchor="middle"
            className="fill-ink text-[10.5px] font-bold"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function TechnologySection() {
  return (
    <section id="technology" className="scroll-mt-24 bg-bg-light py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <FadeIn>
            <h2 className="font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              {technology.heading}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
              {technology.intro}
            </p>
            <Link
              href={technology.linkHref}
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-green-primary pb-1 font-semibold text-ink transition-colors hover:text-green-primary"
            >
              {technology.linkLabel}
              <ArrowUpRight aria-hidden size={18} />
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            <LoopDiagram />
            <p className="mt-4 text-center text-sm text-ink/70">
              {technology.loopCaption}
            </p>
          </FadeIn>
        </div>

        <dl className="mt-20 grid gap-x-12 gap-y-10 border-t border-line pt-12 md:grid-cols-2">
          {technology.concepts.map((c, i) => (
            <FadeIn key={c.title} delay={(i % 2) * 0.08}>
              <div className="flex gap-5">
                <span
                  aria-hidden
                  className="mt-1 font-heading text-sm font-bold text-green-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <dt className="font-heading text-xl font-bold">{c.title}</dt>
                  <dd className="mt-1.5 leading-relaxed text-ink/75">{c.text}</dd>
                </div>
              </div>
            </FadeIn>
          ))}
        </dl>
      </div>
    </section>
  );
}
