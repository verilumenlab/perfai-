import { FadeIn } from "@/components/ui/FadeIn";
import { howItWorks } from "@/content/home";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-shell scroll-mt-24 border-y border-line/70 bg-stone text-ink"
    >
      <div className="section-inner">
        <FadeIn>
          <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-forest">
            {howItWorks.eyebrow}
          </p>
          <h2 className="max-w-2xl font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
            {howItWorks.heading}
          </h2>
        </FadeIn>

        <ol className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.steps.map((item, i) => (
            <li key={item.step}>
              <FadeIn delay={i * 0.04}>
                <article className="surface-card flex h-full flex-col p-5 sm:p-6">
                  <span className="font-mono text-xs font-bold text-forest">
                    {item.step}
                  </span>
                  <h3 className="font-heading mt-4 text-base font-bold tracking-tight sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/68">
                    {item.text}
                  </p>
                </article>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
