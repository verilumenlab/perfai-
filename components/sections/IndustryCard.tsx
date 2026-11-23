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
    <div className="group bg-bg-surface border border-border-dark hover:border-green-primary/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-md">
      {/* Neutral Clean Visual Placeholder with Fixed Aspect Ratio */}
      <div className="relative aspect-[16/10] w-full bg-bg-deep border-b border-border-dark flex flex-col justify-between p-5 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#23A875 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-mint-accent bg-bg-surface px-2.5 py-1 rounded-full border border-border-dark">
            Sector 0{index + 1}
          </span>
          <div className="h-2 w-2 rounded-full bg-green-primary group-hover:scale-125 transition-transform" />
        </div>

        <div className="relative z-10">
          <span className="text-xs font-mono text-text-muted">
            Asset Optimization
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-heading font-bold text-lg text-white group-hover:text-mint-accent transition-colors">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border-dark">
          <Link
            href="/application"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-mint-accent group-hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>Explore Application</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

