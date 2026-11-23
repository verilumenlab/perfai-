import {
  BadgeDollarSign,
  GraduationCap,
  Wrench,
  Briefcase,
  Megaphone,
  Headphones,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { partnerBenefits } from "@/content/home";

const icons = {
  margins: BadgeDollarSign,
  training: GraduationCap,
  presales: Wrench,
  demo: Briefcase,
  marketing: Megaphone,
  support: Headphones,
} as const;

export function PartnerBenefitsSection() {
  return (
    <section
      id="partner-benefits"
      className="section-shell scroll-mt-24 border-y border-line/70 bg-stone text-ink"
    >
      <div className="section-inner">
        <FadeIn>
          <div className="max-w-2xl">
            <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              {partnerBenefits.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">
              {partnerBenefits.text}
            </p>
          </div>
        </FadeIn>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partnerBenefits.items.map((item, i) => {
            const Icon = icons[item.key as keyof typeof icons];
            return (
              <li key={item.key}>
                <FadeIn delay={(i % 3) * 0.04}>
                  <article className="surface-card h-full p-6 transition-colors hover:border-green-primary/25">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-green-primary/10 text-forest">
                      <Icon aria-hidden className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-heading text-base font-bold tracking-tight sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/68">
                      {item.text}
                    </p>
                  </article>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
