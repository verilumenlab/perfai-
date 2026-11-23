/**
 * Application tour content.
 * Factual walkthrough of Senatria solutions inside a facility.
 */

export interface FacilityZone {
  id: string;
  zone: string;
  product: string;
  title: string;
  description: string;
}

export const applicationContent = {
  header: {
    badge: "Facility Walkthrough",
    heading: "Inside the Physical AI Building",
    subheading:
      "Senatria's ATRIA platform and Shield solutions operate across key infrastructure zones to optimize efficiency and maintain reliability.",
  },
  zones: [
    {
      id: "energy",
      zone: "Zone 01 — Energy & Metering",
      product: "GridShield",
      title: "Demand Response & Grid Flexibility",
      description:
        "Coordinates building electrical loads during utility events to capture demand-side incentives while protecting occupant operations.",
    },
    {
      id: "central-plant",
      zone: "Zone 02 — Central Plant & HVAC",
      product: "BuildingShield",
      title: "Dynamic Chiller & Thermal Optimization",
      description:
        "Tuning HVAC setpoints dynamically according to ambient conditions and diagnosing equipment drift before costly failures.",
    },
    {
      id: "floors",
      zone: "Zone 03 — Occupied Spaces",
      product: "ATRIA Autonomous Loop",
      title: "Environmental Governance",
      description:
        "Coordinating airflow, temperature, and lighting to match actual presence, reducing conditioning in unoccupied zones.",
    },
    {
      id: "compute",
      zone: "Zone 04 — Edge Compute Room",
      product: "ComputeShield",
      title: "Power & Thermal Headroom",
      description:
        "Evaluating and qualifying available power headroom to support local micro-colocation and AI inference workloads.",
    },
    {
      id: "operations",
      zone: "Zone 05 — Operations Center",
      product: "VERITAS",
      title: "Measurement & Verification",
      description:
        "Logging verified energy and cost improvements against baseline models to deliver auditable operational proof.",
    },
  ] as FacilityZone[],
};

