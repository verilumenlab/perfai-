"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { applicationContent, type WalkthroughZone } from "@/content/application";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BuildingPoster } from "@/components/three/BuildingPoster";
import {
  Building2,
  Cpu,
  Zap,
  Server,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// Dynamic import of 3D Scene with ssr: false
const BuildingScene = dynamic(
  () => import("@/components/three/BuildingScene").then((m) => m.BuildingScene),
  {
    ssr: false,
    loading: () => <BuildingPoster />,
  }
);

const zoneIcons: Record<string, React.ReactNode> = {
  overview: <Building2 className="w-5 h-5 text-mint-accent" />,
  hvac: <Cpu className="w-5 h-5 text-mint-accent" />,
  energy: <Zap className="w-5 h-5 text-mint-accent" />,
  compute: <Server className="w-5 h-5 text-mint-accent" />,
  verification: <ShieldCheck className="w-5 h-5 text-mint-accent" />,
};

export function BuildingWalkthrough() {
  const { zones } = applicationContent.walkthrough;
  const [activeZone, setActiveZone] = useState<WalkthroughZone>(zones[0]);

  return (
    <div className="w-full">
      {/* Interactive 3D Walkthrough Viewport + Zone Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 3D Canvas / Poster */}
        <div className="lg:col-span-7">
          <div className="relative">
            <BuildingScene
              mode="walkthrough"
              activeZoneId={activeZone.id}
              className="shadow-2xl"
            />
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-text-muted px-1">
              <span>Active Target: {activeZone.floorLabel}</span>
              <span className="text-mint-accent">{activeZone.product}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Zone Selector Buttons & Active Explanatory Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2" role="tablist" aria-label="Building Zones">
            {zones.map((zone) => {
              const isActive = activeZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${zone.id}`}
                  onClick={() => setActiveZone(zone)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent ${
                    isActive
                      ? "bg-bg-surface border-green-primary shadow-md text-white"
                      : "bg-bg-deep border-border-dark text-text-muted hover:border-green-primary/40 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        isActive
                          ? "bg-bg-deep border-green-primary/30"
                          : "bg-bg-surface border-border-dark"
                      }`}
                    >
                      {zoneIcons[zone.id]}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-green-primary font-semibold block">
                        {zone.floorLabel}
                      </span>
                      <span className="text-xs font-bold font-heading">
                        {zone.name}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? "text-mint-accent translate-x-0.5" : "text-text-muted"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Zone Detail Card */}
          <Card
            id={`panel-${activeZone.id}`}
            role="tabpanel"
            className="mt-2 bg-bg-surface border-border-dark"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-dark">
              <Badge variant="mint">{activeZone.product}</Badge>
              <span className="text-[11px] font-mono text-text-muted">
                {activeZone.system}
              </span>
            </div>

            <h3 className="font-heading font-bold text-lg text-white mt-4">
              {activeZone.name}
            </h3>

            <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
              {activeZone.description}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-bg-deep border border-border-dark">
              <span className="text-[11px] font-semibold text-mint-accent uppercase tracking-wider block mb-1">
                Operational Impact:
              </span>
              <p className="text-xs text-white/90 leading-relaxed">
                {activeZone.buildingImpact}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border-dark flex items-center justify-between">
              <span className="text-[11px] font-mono text-text-muted">
                Safety bounds verified
              </span>
              <Link href="/#demo">
                <Button variant="primary" size="sm">
                  <span>Request Briefing</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Non-3D Plain Stacked List (Accessible & Mobile Fallback) */}
      <div className="mt-20 pt-16 border-t border-border-dark">
        <div className="max-w-2xl mb-8">
          <Badge variant="outline" className="mb-2 text-text-muted">
            Accessible Zone Overview
          </Badge>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
            Facility Zone Impact Summary
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Plain stacked reference of Senatria application capabilities across all building zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <Card key={zone.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-green-primary font-bold">
                    {zone.floorLabel}
                  </span>
                  <Badge variant="mint">{zone.product}</Badge>
                </div>
                <h4 className="font-heading font-bold text-base text-white">
                  {zone.name}
                </h4>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  {zone.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-dark">
                <span className="text-[10px] font-mono text-mint-accent uppercase block mb-1">
                  Impact:
                </span>
                <p className="text-xs text-white/80">
                  {zone.buildingImpact}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
