/**
 * Application / BMS tour content for PerfAI.
 */

export interface ProductEcosystemItem {
  id: string;
  name: string;
  role: string;
  category: "Core" | "Service" | "Capability";
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
    badge: "Building Management",
    headline: "Intelligence That Understands Your Building.",
    subheading:
      "Explore how PerfAI helps facilities apply building management services across HVAC, energy and day-to-day operations.",
    ctaPrimary: "Explore the Services",
    ctaSecondary: "Request a Demo",
  },

  atria: {
    badge: "Operating Approach",
    title: "A Practical Building Management Approach",
    description:
      "PerfAI helps organisations introduce building management services that connect plant, meters and facility workflows — so teams can see what is happening and act with clearer control.",
    loopHeading: "The Building Management Cycle",
    loopDescription:
      "A closed operating cycle to understand, configure and improve building performance.",
    steps: [
      {
        step: "01",
        name: "Assess",
        desc: "Review existing BMS, HVAC plant, meters and operational priorities on site.",
      },
      {
        step: "02",
        name: "Specify",
        desc: "Define the building management services and control scope that fit the facility.",
      },
      {
        step: "03",
        name: "Integrate",
        desc: "Connect controllers, meters and related systems into a workable management layer.",
      },
      {
        step: "04",
        name: "Operate",
        desc: "Run day-to-day control for comfort, plant schedules and energy-aware setpoints.",
      },
      {
        step: "05",
        name: "Monitor",
        desc: "Track performance, alarms and energy use so issues surface early.",
      },
      {
        step: "06",
        name: "Improve",
        desc: "Refine schedules, setpoints and procedures based on measured building behaviour.",
      },
    ],
  },

  ecosystem: [
    {
      id: "hvac",
      name: "HVAC Management",
      role: "Plant & comfort",
      category: "Core" as const,
      headline: "Heating, cooling and air handling under coordinated control",
      description:
        "Support for chillers, AHUs, VAVs and related plant so comfort targets and equipment efficiency stay aligned with how the building is occupied.",
      capabilities: [
        "Central plant coordination",
        "Zone comfort setpoints",
        "Schedule and runtime visibility",
      ],
    },
    {
      id: "energy",
      name: "Energy Monitoring",
      role: "Meters & demand",
      category: "Service" as const,
      headline: "Visibility into consumption, peaks and tariffs",
      description:
        "Metering and demand visibility that helps facility teams understand where energy goes and where peak charges or inefficient plant cycles appear.",
      capabilities: [
        "Sub-meter and main-feed views",
        "Peak demand awareness",
        "Operational energy reporting",
      ],
    },
    {
      id: "integration",
      name: "BMS Integration",
      role: "Systems layer",
      category: "Capability" as const,
      headline: "Connect what you already have",
      description:
        "Integration approaches that respect existing controllers and protocols, reducing the need for a full rip-and-replace of working equipment.",
      capabilities: [
        "Legacy controller connectivity",
        "Unified operational views",
        "Phased rollout support",
      ],
    },
    {
      id: "operations",
      name: "Facility Operations",
      role: "Day-to-day BMS",
      category: "Service" as const,
      headline: "Keep buildings running with clearer control",
      description:
        "Operational practices and tooling support so facility engineers can manage alarms, setpoints and routines with less guesswork.",
      capabilities: [
        "Alarm and exception handling",
        "Operator workflows",
        "Continuous improvement loops",
      ],
    },
  ] as ProductEcosystemItem[],

  walkthrough: {
    heading: "Interactive Building Walkthrough",
    subheading:
      "See how building management services map to physical building assets across key operational zones.",
    zones: [
      {
        id: "overview",
        name: "Building Overview & Envelope",
        floorLabel: "Facility Envelope",
        system: "Unified Building View",
        product: "BMS Core",
        description:
          "A whole-building view that ties occupancy, weather load and major systems into one operational picture.",
        buildingImpact:
          "Gives facility teams a single place to understand how the building is behaving.",
        highlightCoordinates: [0, 6, 0],
      },
      {
        id: "hvac",
        name: "HVAC & Mechanical Central Plant",
        floorLabel: "Roof & Central Plant",
        system: "Chillers, AHUs & Distribution",
        product: "HVAC Management",
        description:
          "Monitors plant telemetry and supports coordinated setpoints for supply air and chilled water within site policies.",
        buildingImpact:
          "Helps engineers stabilise comfort while managing equipment runtime.",
        highlightCoordinates: [0, 10, -2],
      },
      {
        id: "energy",
        name: "Energy Infrastructure & Substation",
        floorLabel: "Base & Utility Connection",
        system: "Power Metering & Distribution",
        product: "Energy Monitoring",
        description:
          "Ingests metering from main feeds and distribution so peak load and consumption patterns are visible.",
        buildingImpact:
          "Supports demand awareness and clearer conversations about energy cost drivers.",
        highlightCoordinates: [2, 1, 3],
      },
      {
        id: "compute",
        name: "Edge & Telemetry Hub",
        floorLabel: "Floor 04 — Edge Node",
        system: "On-site Controllers & Gateways",
        product: "BMS Integration",
        description:
          "On-site controllers and gateways that keep local building systems connected to the management layer.",
        buildingImpact:
          "Keeps critical control close to the equipment while feeding a shared operational view.",
        highlightCoordinates: [-2, 5, 1],
      },
      {
        id: "verification",
        name: "Operations & Performance Review",
        floorLabel: "Command Center",
        system: "Operations Desk",
        product: "Facility Operations",
        description:
          "Compares live operation with expected baselines so teams can verify what changed and why.",
        buildingImpact:
          "Provides facility managers with clearer records of actions and measured outcomes.",
        highlightCoordinates: [0, 3, -3],
      },
    ] as WalkthroughZone[],
  },

  architecture: {
    heading: "Foundations of Building Management",
    subheading:
      "The capabilities PerfAI emphasises when helping customers adopt BMS services.",
    pillars: [
      {
        id: "bms",
        title: "Building Management Systems",
        tagline: "Control layer",
        desc: "Coordinated control of HVAC, metering and related plant through a BMS-centric approach.",
      },
      {
        id: "hvac",
        title: "HVAC & Plant",
        tagline: "Mechanical systems",
        desc: "Focus on chillers, air handlers and distribution that drive comfort and energy use.",
      },
      {
        id: "energy",
        title: "Energy Visibility",
        tagline: "Meters & demand",
        desc: "Clearer insight into consumption and peaks so teams can manage cost and capacity.",
      },
      {
        id: "integration",
        title: "Integration",
        tagline: "Connect existing assets",
        desc: "Work with installed controllers and site systems instead of discarding them.",
      },
      {
        id: "operations",
        title: "Facility Operations",
        tagline: "People & process",
        desc: "Support for the operators who run buildings every day.",
      },
      {
        id: "channel",
        title: "Channel Partnership",
        tagline: "PerfAI role",
        desc: "Commercial engagement and deployment coordination as your BMS channel partner.",
      },
    ],
  },
};
