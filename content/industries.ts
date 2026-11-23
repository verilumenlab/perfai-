/**
 * Industry sector content.
 * Factual applications across target enterprise sectors.
 */

export interface IndustrySector {
  id: string;
  title: string;
  description: string;
}

export const industriesContent = {
  heading: "Intelligence Across Every Infrastructure",
  subheading:
    "Applying Physical AI to infrastructure sectors where efficiency and resilience are critical.",
  sectors: [
    {
      id: "commercial-buildings",
      title: "Commercial Buildings",
      description:
        "Optimizing central plant HVAC, tenant comfort, and peak demand charges.",
    },
    {
      id: "hospitality",
      title: "Hospitality",
      description:
        "Maintaining indoor environmental quality and guest comfort under variable occupancy.",
    },
    {
      id: "data-centres",
      title: "Data Centres",
      description:
        "Managing high-density thermal loads and optimizing Power Usage Effectiveness (PUE).",
    },
    {
      id: "industrial-infrastructure",
      title: "Industrial Infrastructure",
      description:
        "Coordinating industrial cooling, compressed air, and electrical load balancing.",
    },
    {
      id: "energy-grid",
      title: "Energy & Grid",
      description:
        "Aggregating building capacity to provide grid demand response and flexibility services.",
    },
  ] as IndustrySector[],
};

