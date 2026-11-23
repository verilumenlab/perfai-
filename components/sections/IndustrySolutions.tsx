import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Factory,
  Hotel,
  Server,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { industries, type IndustryKey } from "@/content/home";

const ICONS: Record<IndustryKey, LucideIcon> = {
  commercial: Building2,
  hospitality: Hotel,
  datacentres: Server,
  industrial: Factory,
  energy: Zap,
};

function IndustryCard({
  item,
  index,
}: {
  item: (typeof industries)[number];
  index: number;
}) {
  const Icon = ICONS[item.key];
  return (
    <FadeIn delay={(index % 3) * 0.08} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-dark bg-bg-surface transition-colors duration-300 hover:border-mint-accent/40">
        <div className="relative aspect-[16/10] overflow-hidden bg-bg-deep">
          {item.image ? (
            <Image
              src={item.image}
              alt={`${item.title}`}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,var(--bg-surface),var(--bg-deep))]">
              <Icon
                aria-hidden
                size={44}
                strokeWidth={1.25}
                className="text-mint-accent/70"
              />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-heading text-xl font-bold text-white">
            {item.title}
          </h3>
          <p className="mt-2 flex-1 leading-relaxed text-text-muted">
            {item.text}
          </p>
          <Link
            href={item.href}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mint-accent"
          >
            Explore the application
            <ArrowRight
              aria-hidden
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </article>
    </FadeIn>
  );
}

export function IndustrySolutions() {
  const top = industries.slice(0, 3);
  const bottom = industries.slice(3);
  return (
    <section id="industries" className="bg-bg-deep py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        <FadeIn>
          <h2 className="max-w-3xl font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Intelligence Across Every Infrastructure.
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {top.map((item, i) => (
            <IndustryCard key={item.key} item={item} index={i} />
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:mx-auto lg:max-w-[800px]">
          {bottom.map((item, i) => (
            <IndustryCard key={item.key} item={item} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
