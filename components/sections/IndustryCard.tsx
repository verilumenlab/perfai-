import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { IndustrySector } from "@/content/industries";

interface IndustryCardProps {
  item: IndustrySector;
  index: number;
}

export function IndustryCard({ item, index }: IndustryCardProps) {
  return (
    <div className="group border-t border-border-dark pt-6 flex flex-col justify-between">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-mint-accent">
          Sector 0{index + 1}
        </span>
        <h3 className="font-heading font-bold text-xl text-white mt-3 group-hover:text-mint-accent transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-text-muted mt-3 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/application"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-mint-accent hover:text-white transition-colors"
        >
          <span>Explore Application</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
