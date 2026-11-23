/**
 * Factual content for the homepage.
 * Sourced directly from senatria.ai.
 */

export interface ProductSummary {
  name: string;
  role: string;
  description: string;
}

export interface TechnologyConcept {
  id: string;
  name: string;
  title: string;
  summary: string;
}

export const homeContent = {
  hero: {
    headline: "Make Your Infrastructure Smarter. More Efficient. More Valuable.",
    supportingText:
      "Discover Senatria's Physical AI platform and solutions, brought to you by PerfAI, your trusted technology partner.",
    ctaPrimary: "Request a Demo",
    ctaSecondary: "Explore Solutions",
  },
  products: [
    {
      name: "ATRIA",
      role: "Physical AI Platform",
      description:
        "The core operating platform executing a continuous loop: Perceive, Analyse, Optimise, Control, Verify, and Learn.",
    },
    {
      name: "BuildingShield",
      role: "Building Asset Optimization",
      description:
        "Integrates with existing BMS and HVAC to optimize performance and unlock operational headroom.",
    },
    {
      name: "GridShield",
      role: "Grid Flexibility & Demand Response",
      description:
        "Coordinates building capacity to support grid constraints and demand response programs.",
    },
    {
      name: "ComputeShield",
      role: "Distributed Edge Compute",
      description:
        "Qualifies power and cooling headroom to enable edge compute and micro-colocation.",
    },
  ] as ProductSummary[],
  technology: {
    heading: "Physical AI for Real Infrastructure",
    description:
      "Senatria connects intelligence with real-world infrastructure, helping organisations understand operations, optimise performance and enable governed actions.",
    concepts: [
      {
        id: "physical-ai",
        name: "Physical AI",
        title: "Perceive, Optimise, and Act",
        summary:
          "Intelligence that understands physical environments, anticipates needs, and acts safely within approved operational bounds.",
      },
      {
        id: "digital-twins",
        name: "Digital Twins",
        title: "Living Operational Models",
        summary:
          "High-fidelity operational models simulating cause-and-effect for predictive decisions.",
      },
      {
        id: "ai-agents",
        name: "AI Agents",
        title: "Governed Autonomous Workflows",
        summary:
          "Coordinating complex adjustments with site-defined permissions and safety interlocks.",
      },
      {
        id: "infrastructure-intelligence",
        name: "Infrastructure Intelligence",
        title: "Unified Decision-Grade Data",
        summary:
          "Unifies BMS, telemetry, and energy meters into actionable operational truth.",
      },
      {
        id: "edge-intelligence",
        name: "Edge Intelligence",
        title: "Low-Latency Local Execution",
        summary:
          "Executes models directly at the asset edge for uninterrupted physical resilience.",
      },
      {
        id: "performance-verification",
        name: "Performance Verification",
        title: "VERITAS Verification Ledger",
        summary:
          "Attributes measured evidence across Triple Net Value: Net Profit, Net Zero, and Net Positive outcomes.",
      },
    ] as TechnologyConcept[],
  },
};
