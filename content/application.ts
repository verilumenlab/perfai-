/**
 * Factual application tour and product architecture content.
 * Sourced directly from senatria.ai.
 */

export interface ProductEcosystemItem {
  id: string;
  name: string;
  role: string;
  category: "Platform" | "Shield Solution" | "Platform Capability";
  headline: string;
  description: string;
  capabilities: string[];
}

export interface WalkthroughZone {
  id: string;
  name: string;
  floorLabel: string;
  system: string;
  product: string;
  description: string;
  buildingImpact: string;
  highlightCoordinates: [number, number, number];
}

export const applicationContent = {
  hero: {
    badge: "Senatria Technology Architecture",
    headline: "Intelligence That Understands Your Infrastructure.",
    subheading:
      "Explore how Senatria's Physical AI platform connects infrastructure intelligence with real-world operational systems.",
    ctaPrimary: "Explore the Technology",
    ctaSecondary: "Request a Demo",
  },

  atria: {
    badge: "Core Operating Platform",
    title: "The Physical AI Operating Platform",
    description:
      "ATRIA is Senatria's central platform for infrastructure intelligence and governed action. It connects real physical assets—including central plants, power feeds, and edge networks—with predictive models and coordinated AI agent swarms.",
    loopHeading: "The Continuous Autonomous Loop",
    loopDescription:
      "ATRIA executes a closed-loop governance cycle to understand, simulate, and optimize real-world operations safely.",
    steps: [
      {
        step: "01",
        name: "Perceive",
        desc: "Ingests live operational telemetry from BMS, power meters, environmental sensors, and equipment controllers.",
      },
      {
        step: "02",
        name: "Analyse",
        desc: "Builds physics-grounded digital twins and world models to establish actual operational truth.",
      },
      {
        step: "03",
        name: "Optimise",
        desc: "AI agent swarms simulate cause-and-effect paths to discover efficiency and capacity headroom.",
      },
      {
        step: "04",
        name: "Control",
        desc: "Dispatches bounded setpoint adjustments to edge controllers within strict, pre-approved safety limits.",
      },
      {
        step: "05",
        name: "Verify",
        desc: "Logs measurable performance outcomes into the VERITAS ledger, separating real evidence from theoretical models.",
      },
      {
        step: "06",
        name: "Learn",
        desc: "Continuously updates operational models so the infrastructure adapts to seasonal and occupancy shifts.",
      },
    ],
  },

  ecosystem: [
    {
      id: "atria",
      name: "ATRIA",
      role: "Physical AI Platform",
      category: "Platform",
      headline: "Governed Infrastructure Operating System",
      description:
        "The foundational platform that transforms connected facilities into sentient infrastructure. ATRIA provides the operational data mesh, agent coordination framework, and safety boundary enforcement required for autonomous facility decisions.",
      capabilities: [
        "Continuous closed-loop physical governance",
        "Deterministic bounds for safe setpoint execution",
        "Seamless telemetry ingestion from BMS and IoT gateways",
      ],
    },
    {
      id: "buildingshield",
      name: "BuildingShield",
      role: "Building Asset Optimization",
      category: "Shield Solution",
      headline: "HVAC, BMS & Facility Asset Performance",
      description:
        "Directly integrates with existing Building Management Systems (BMS), chillers, air handlers, and metering. It evaluates optimal operating states, detects subtle equipment drift, and unlocks operational headroom without compromising occupant comfort.",
      capabilities: [
        "Dynamic chilled water and airflow setpoint optimization",
        "Predictive fault detection across dampers, valves, and compressors",
        "Significant peak demand charge reduction",
      ],
    },
    {
      id: "gridshield",
      name: "GridShield",
      role: "Grid Flexibility & Demand Response",
      category: "Shield Solution",
      headline: "Coordinated Building Flexibility for the Grid",
      description:
        "Aggregates the usable electrical capacity and thermal inertia within building portfolios. GridShield coordinates automated demand response events, curtailing peak loads to support utility grid stability and capture energy market incentives.",
      capabilities: [
        "Automated demand-response load shifting",
        "Real-time grid constraint telemetry integration",
        "Portfolio-wide demand peak shaving",
      ],
    },
    {
      id: "computeshield",
      name: "ComputeShield",
      role: "Distributed Edge Computing",
      category: "Shield Solution",
      headline: "Micro-Colocation & Power-Constrained Growth",
      description:
        "Identifies and qualifies unused electrical and thermal headroom within existing commercial structures, enabling operators to deploy distributed edge compute and micro-colocation where grid interconnection delays previously stalled expansion.",
      capabilities: [
        "Dynamic electrical and thermal headroom qualification",
        "Micro-colocation deployment feasibility modeling",
        "Synchronized power and cooling envelope monitoring",
      ],
    },
    {
      id: "veritas",
      name: "VERITAS",
      role: "Measurement & Verification Ledger",
      category: "Platform Capability",
      headline: "Evidence-Based Triple Net Value Verification",
      description:
        "Senatria's embedded measurement and verification ledger. VERITAS measures actual physical telemetry outcomes against baseline models, delivering auditable proof across Triple Net Value metrics: Net Profit, Net Zero carbon accounting, and Net Positive asset performance.",
      capabilities: [
        "Auditable baseline outcome attribution",
        "Triple Net Value (Net Profit, Net Zero, Net Positive) tracking",
        "Elimination of theoretical or unmeasured claims",
      ],
    },
  ] as ProductEcosystemItem[],

  walkthrough: {
    heading: "Interactive Building Walkthrough",
    subheading:
      "Explore how Physical AI maps directly to physical building assets across five critical operational zones.",
    zones: [
      {
        id: "overview",
        name: "Building Overview & Envelope",
        floorLabel: "Facility Envelope",
        system: "Unified Telemetry & Structural Core",
        product: "ATRIA Platform Core",
        description:
          "The building envelope serves as a living physical twin. Environmental sensors and architectural telemetry continuously model ambient heat load and external weather conditions.",
        buildingImpact:
          "Establishes a single source of operational truth across all mechanical and electrical subsystems.",
        highlightCoordinates: [0, 6, 0],
      },
      {
        id: "hvac",
        name: "HVAC & Mechanical Central Plant",
        floorLabel: "Roof & Central Plant",
        system: "Chillers, Boilers & Air Handling Units",
        product: "BuildingShield",
        description:
          "Monitors thermodynamic heat exchange and refrigerant pressures. Automatically tunes supply air and chilled water setpoints in response to live thermal demand.",
        buildingImpact:
          "Eliminates equipment over-cycling, prevents component drift, and reduces HVAC energy expenditure.",
        highlightCoordinates: [0, 12, 0],
      },
      {
        id: "energy",
        name: "Energy Infrastructure & Substation",
        floorLabel: "Base & Utility Connection",
        system: "Switchgear, Sub-Meters & Solar Feeds",
        product: "GridShield",
        description:
          "Ingests sub-minute power metering data from main switchboards and utility interconnects. Evaluates facility load shed capacity for grid demand response events.",
        buildingImpact:
          "Mitigates costly peak demand charges and unlocks demand-side flexibility revenue.",
        highlightCoordinates: [-3, 1, 0],
      },
      {
        id: "compute",
        name: "Edge Compute & Telemetry Hub",
        floorLabel: "Floor 04 — Edge Node",
        system: "High-Density Server Racks & UPS",
        product: "ComputeShield",
        description:
          "Evaluates thermal dissipation and qualified electrical capacity to house local micro-colocation and low-latency AI inference nodes.",
        buildingImpact:
          "Enables new computational density inside existing commercial real estate without grid capacity upgrades.",
        highlightCoordinates: [2, 5.8, 0],
      },
      {
        id: "verification",
        name: "Operations & Verification Ledger",
        floorLabel: "Command Center",
        system: "VERITAS Verification Ledger",
        product: "VERITAS Platform Capability",
        description:
          "Compares live operational energy consumption with pre-deployment baseline physics models, continuously logging verifiable efficiency gains.",
        buildingImpact:
          "Provides finance and sustainability executives with immutable proof of operational cost savings and carbon abatement.",
        highlightCoordinates: [0, 3, 0],
      },
    ] as WalkthroughZone[],
  },

  architecture: {
    heading: "The Six Pillars of Physical AI",
    subheading:
      "Senatria combines advanced computing paradigms to connect digital intelligence directly with physical machines.",
    pillars: [
      {
        id: "physical-ai",
        title: "Physical AI",
        tagline: "Intelligence that acts in the physical world",
        desc: "Unlike digital-only generative AI, Physical AI understands thermodynamics, mechanical constraints, and fluid dynamics, executing bounded setpoint commands safely.",
      },
      {
        id: "digital-twins",
        title: "Digital Twins & World Models",
        tagline: "Physics-grounded simulation",
        desc: "Continuously calibrated operational models of building physics that simulate the causal impact of temperature, weather, and occupancy before actions are taken.",
      },
      {
        id: "ai-agents",
        title: "AI Agent Swarms",
        tagline: "Specialised, coordinated decision-making",
        desc: "Domain-specific agents (e.g. Chiller Agent, Comfort Agent, Demand Agent) collaborate to solve competing operational priorities within strict governance rules.",
      },
      {
        id: "infrastructure-intelligence",
        title: "Infrastructure Intelligence",
        tagline: "Unified decision-grade operational truth",
        desc: "Connects legacy, siloed Building Management Systems (BACnet, Modbus, MQTT) into a standardized real-time data layer.",
      },
      {
        id: "edge-intelligence",
        title: "Edge Intelligence",
        tagline: "Low-latency on-premise execution",
        desc: "Deploys inference engines directly onto on-site hardware gateways, ensuring continuous autonomy even during cloud network interruptions.",
      },
      {
        id: "performance-verification",
        title: "Performance Verification",
        tagline: "VERITAS measurable evidence",
        desc: "Attributes actual measured kilowatt-hours and financial performance directly to autonomous setpoint interventions.",
      },
    ],
  },
};
