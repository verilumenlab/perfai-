import { FadeIn } from "@/components/ui/FadeIn";
import { why } from "@/content/home";

export function WhyPerfAI() {
  return (
    <section id="why-perfai" className="section-shell scroll-mt-24 bg-bg-light text-ink">
      <div className="section-inner grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <FadeIn>
          <div className="lg:sticky lg:top-28">
            <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              {why.heading}
            </h2>
          </div>
        </FadeIn>

        <ol className="divide-y divide-line/80">
          {why.points.map((p, i) => (
            <li key={p.title}>
              <FadeIn delay={i * 0.05}>
                <div className="grid gap-2 py-7 sm:grid-cols-[3.25rem_1fr] sm:gap-4">
                  <span
                    aria-hidden
                    className="font-heading text-2xl font-extrabold text-green-primary/90"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/70">
                      {p.text}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
