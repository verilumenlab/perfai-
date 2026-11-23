"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { applicationContent, type WalkthroughZone } from "@/content/application";
import { Card } from "@/components/ui/Card";
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

const BuildingScene = dynamic(
  () => import("@/components/three/BuildingScene").then((m) => m.BuildingScene),
  {
    ssr: false,
    loading: () => <BuildingPoster />,
  }
);

const zoneIcons: Record<string, React.ReactNode> = {
  overview: <Building2 className="w-5 h-5 text-forest" />,
  hvac: <Cpu className="w-5 h-5 text-forest" />,
  energy: <Zap className="w-5 h-5 text-forest" />,
  compute: <Server className="w-5 h-5 text-forest" />,
  verification: <ShieldCheck className="w-5 h-5 text-forest" />,
};

export function BuildingWalkthrough() {
  const { zones } = applicationContent.walkthrough;
  const [activeZone, setActiveZone] = useState<WalkthroughZone>(zones[0]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <div className="relative">
            <BuildingScene
              mode="walkthrough"
              activeZoneId={activeZone.id}
            />
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
              <span>Active Target: {activeZone.floorLabel}</span>
              <span className="text-forest">{activeZone.product}</span>
            </div>
          </div>
        </div>

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
                  className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                    isActive
                      ? "bg-bg-panel border-forest text-ink shadow-sm"
                      : "bg-bg-canvas border-line text-ink-muted hover:border-forest/40 hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        isActive
                          ? "bg-stone border-forest/30"
                          : "bg-bg-panel border-line"
                      }`}
                    >
                      {zoneIcons[zone.id]}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-forest font-semibold block">
                        {zone.floorLabel}
                      </span>
                      <span className="text-xs font-bold font-heading">
                        {zone.name}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? "text-forest translate-x-0.5" : "text-ink-muted"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <Card
            id={`panel-${activeZone.id}`}
            role="tabpanel"
            className="mt-2"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <span className="text-xs font-semibold uppercase tracking-wider text-forest">
                {activeZone.product}
              </span>
              <span className="text-[11px] font-mono text-ink-muted">
                {activeZone.system}
              </span>
            </div>

            <h3 className="font-heading font-bold text-lg text-ink mt-4">
              {activeZone.name}
            </h3>

            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              {activeZone.description}
            </p>

            <div className="mt-4 p-3 rounded-lg bg-stone border border-line">
              <span className="text-[11px] font-semibold text-forest uppercase tracking-wider block mb-1">
                Operational Impact
              </span>
              <p className="text-sm text-ink leading-relaxed">
                {activeZone.buildingImpact}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-muted">
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

      <div className="mt-20 pt-16 border-t border-line">
        <div className="max-w-2xl mb-8">
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink">
            Facility Zone Impact Summary
          </h3>
          <p className="text-sm text-ink-muted mt-1">
            Plain stacked reference of building management capabilities across all facility zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {zones.map((zone) => (
            <div key={zone.id} className="border-t border-line pt-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-forest font-bold">
                    {zone.floorLabel}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                    {zone.product}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-base text-ink">
                  {zone.name}
                </h4>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                  {zone.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-line">
                <span className="text-[10px] font-mono text-forest uppercase block mb-1">
                  Impact
                </span>
                <p className="text-sm text-ink">
                  {zone.buildingImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
