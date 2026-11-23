/**
 * Industry sector content for building management services.
 */

export interface IndustrySector {
  id: string;
  title: string;
  description: string;
}

export const industriesContent = {
  heading: "Building Management Across Sectors",
  subheading:
    "Applying BMS services where comfort, energy and reliability matter most.",
  sectors: [
    {
      id: "commercial-buildings",
      title: "Commercial Buildings",
      description:
        "Optimising central plant HVAC, tenant comfort and peak demand charges.",
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
        "Managing high-density thermal loads and cooling plant performance.",
    },
    {
      id: "industrial-infrastructure",
      title: "Industrial Infrastructure",
      description:
        "Coordinating industrial cooling, compressed air and electrical load visibility.",
    },
    {
      id: "energy-grid",
      title: "Energy & Utilities",
      description:
        "Improving visibility of building demand and operational energy use.",
    },
  ] as IndustrySector[],
};
