import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { homeContent } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { BuildingPoster } from "@/components/three/BuildingPoster";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const { hero, products } = homeContent;

  return (
    <section className="relative w-full pt-12 pb-20 md:pt-20 md:pb-28 bg-bg-deep overflow-hidden">
      {/* Soft gradient illumination */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-green-primary/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <FadeIn direction="up">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Reseller / Partner Badge */}
            <Badge variant="default" className="mb-6">
              <span className="h-2 w-2 rounded-full bg-green-primary" />
              <span>{siteConfig.resellerBadge}</span>
            </Badge>

            {/* H1 Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
              Make Your Infrastructure Smarter.{" "}
              <span className="text-mint-accent">More Efficient. More Valuable.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-text-muted max-w-2xl leading-relaxed">
              {hero.supportingText}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/application" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <span>Explore the Application</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/#demo" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <span>Request a Demo</span>
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* 3D Scene Poster Fallback Area */}
        <FadeIn delay={0.2} className="mt-12 sm:mt-16">
          <BuildingPoster />
        </FadeIn>

        {/* Four Product Labels */}
        <FadeIn delay={0.3} className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p, idx) => (
              <Card
                key={idx}
                className="group transition-all duration-200 hover:border-green-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-mint-accent uppercase tracking-wider">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">0{idx + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white mt-2 group-hover:text-mint-accent transition-colors">
                  {p.role}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {p.description}
                </p>
              </Card>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

