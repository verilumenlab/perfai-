import { Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { partnerTiers } from "@/content/home";

export function PartnerTiersSection() {
  return (
    <section
      id="partner-tiers"
      className="section-shell scroll-mt-24 bg-bg-light text-ink"
    >
      <div className="section-inner">
        <FadeIn>
          <div className="max-w-2xl">
            <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              {partnerTiers.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">
              {partnerTiers.text}
            </p>
          </div>
        </FadeIn>

        <ul className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          {partnerTiers.tiers.map((tier, i) => (
            <li key={tier.key} className="flex">
              <FadeIn delay={i * 0.05} className="flex w-full">
                <article
                  className={[
                    "flex w-full flex-col rounded-2xl border p-6 sm:p-7",
                    tier.featured
                      ? "border-bg-deep/90 bg-bg-deep text-white shadow-[0_20px_50px_-28px_rgba(7,27,23,0.55)]"
                      : "border-line/80 bg-white text-ink",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-lg font-extrabold tracking-tight sm:text-xl">
                      {tier.name}
                    </h3>
                    {tier.badge && (
                      <span className="shrink-0 rounded-full bg-mint-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-bg-deep">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={[
                      "mt-2 text-sm leading-relaxed",
                      tier.featured ? "text-white/68" : "text-ink/68",
                    ].join(" ")}
                  >
                    {tier.blurb}
                  </p>

                  <div className="mt-7">
                    <p className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {tier.discountLabel}
                    </p>
                    <p
                      className={[
                        "mt-1 text-sm",
                        tier.featured ? "text-white/60" : "text-ink/60",
                      ].join(" ")}
                    >
                      {tier.discountNote}
                    </p>
                  </div>

                  <ul className="mt-7 flex flex-col gap-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check
                          aria-hidden
                          className={[
                            "mt-0.5 h-4 w-4 shrink-0",
                            tier.featured ? "text-mint-accent" : "text-forest",
                          ].join(" ")}
                          strokeWidth={2.25}
                        />
                        <span
                          className={
                            tier.featured ? "text-white/88" : "text-ink/82"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p
                    className={[
                      "mt-auto border-t pt-4 text-xs leading-relaxed",
                      tier.featured
                        ? "border-white/12 text-white/50"
                        : "border-line text-ink/50",
                    ].join(" ")}
                  >
                    {tier.requirement}
                  </p>
                </article>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
