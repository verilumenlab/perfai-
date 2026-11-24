import { CheckCircle, Mail } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { DemoForm } from "@/components/forms/DemoForm";
import { cta } from "@/content/home";
import { siteConfig } from "@/lib/site-config";

export function CTASection() {
  return (
    <section
      id="demo"
      className="section-shell scroll-mt-24 border-t border-line/70 bg-stone text-ink"
    >
      <div id="partner" className="sr-only" aria-hidden="true" />
      <div id="contact" className="sr-only" aria-hidden="true" />

      <div className="section-inner grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <FadeIn>
          <h2 className="font-heading text-[clamp(1.85rem,3.8vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
            {cta.heading}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70 sm:text-lg">
            {cta.text}
          </p>

          <ul className="mt-7 max-w-md space-y-2.5">
            {cta.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink/85">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line/80 pt-5">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-forest">
              Direct Enquiries
            </span>
            <p className="text-sm leading-relaxed text-ink-muted">
              For corporate procurement and official business correspondence:
            </p>
            <div className="mt-2.5 flex flex-col gap-1.5 text-sm text-ink">
              <span className="font-semibold">{siteConfig.contact.name}</span>
              <a
                href={`mailto:${siteConfig.contact.salesEmail}`}
                className="flex items-center gap-2 font-mono hover:text-forest"
              >
                <Mail className="h-3.5 w-3.5 text-forest" />
                <span>{siteConfig.contact.salesEmail}</span>
              </a>
              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-center gap-2 font-mono hover:text-forest"
              >
                <span className="h-3.5 w-3.5 text-center text-forest">☎</span>
                <span>{siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="surface-card p-5 shadow-[0_18px_48px_-36px_rgba(12,22,18,0.4)] sm:p-7">
            <div className="mb-5">
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-forest">
                Get in Touch
              </span>
              <h3 className="font-heading mt-1 text-lg font-bold text-ink sm:text-xl">
                Request a Demo or Partnership Chat
              </h3>
            </div>
            <DemoForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
