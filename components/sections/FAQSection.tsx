import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { faq } from "@/content/home";

export function FAQSection() {
  return (
    <section
      id="faq"
      className="section-shell scroll-mt-24 bg-bg-light text-ink"
    >
      <div className="section-inner grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <FadeIn>
          <div className="lg:sticky lg:top-28">
            <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-forest">
              {faq.eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(1.85rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              {faq.heading}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
              {faq.text}
            </p>
            <Link
              href="/#demo"
              className="mt-7 inline-flex border-b border-green-primary pb-0.5 text-sm font-semibold text-ink transition-colors hover:text-green-primary"
            >
              Go to Contact Us
            </Link>
          </div>
        </FadeIn>

        <div className="divide-y divide-line/80">
          {faq.items.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.03}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-[15px] font-bold tracking-tight marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-sm text-forest transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-8 text-sm leading-relaxed text-ink/68">
                  {item.a}
                </p>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
