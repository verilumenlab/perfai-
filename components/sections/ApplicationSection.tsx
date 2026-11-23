import { CheckCircle } from "lucide-react";
import { applicationContent } from "@/content/application";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { BuildingWalkthrough } from "@/components/application/BuildingWalkthrough";

export function ApplicationSection() {
  const { atria, ecosystem, walkthrough } = applicationContent;

  return (
    <div id="application" className="scroll-mt-24 text-ink">
      <section className="border-b border-line bg-stone py-20 md:py-28">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {atria.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                {atria.description}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-14">
            <div className="rounded-xl border border-line bg-bg-panel p-6 sm:p-10">
              <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-center">
                <div>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                    Governance Framework
                  </span>
                  <h3 className="font-heading mt-1 text-xl font-bold text-ink sm:text-2xl">
                    {atria.loopHeading}
                  </h3>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
                {atria.steps.map((st) => (
                  <div
                    key={st.step}
                    className="flex min-h-[140px] flex-col justify-between bg-bg-panel p-5"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-forest">
                        {st.step}
                      </span>
                      <h4 className="font-heading mt-1 text-base font-bold text-ink">
                        {st.name}
                      </h4>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="border-b border-line bg-bg-canvas py-20 md:py-28">
        <Container>
          <FadeIn>
            <div className="max-w-3xl">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Building Management Services
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                Practical service areas PerfAI helps customers adopt — HVAC, energy,
                integration and day-to-day facility operations.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14 space-y-0 divide-y divide-line border-y border-line">
            {ecosystem.map((prod) => (
              <FadeIn key={prod.id}>
                <article className="py-10">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-heading text-2xl font-extrabold text-ink">
                          {prod.name}
                        </h3>
                        <span className="text-xs font-semibold uppercase tracking-wider text-forest">
                          {prod.category}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-forest">
                        {prod.headline}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-ink-muted">{prod.role}</span>
                  </div>

                  <p className="mt-5 max-w-4xl text-sm leading-relaxed text-ink-muted">
                    {prod.description}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {prod.capabilities.map((cap) => (
                      <div key={cap} className="flex items-start gap-2.5 text-sm text-ink">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section id="walkthrough" className="scroll-mt-24 border-b border-line bg-stone py-20 md:py-28">
        <Container>
          <FadeIn>
            <div className="mb-12 max-w-3xl">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {walkthrough.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {walkthrough.subheading}
              </p>
            </div>
          </FadeIn>
          <BuildingWalkthrough />
        </Container>
      </section>
    </div>
  );
}
