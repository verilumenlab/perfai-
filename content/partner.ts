/**
 * Partner and reseller content.
 * Explains PerfAI's role as authorised reseller and engagement framework.
 */

export interface EngagementStep {
  step: string;
  title: string;
  summary: string;
}

export const partnerContent = {
  header: {
    badge: "Authorised Partnership",
    heading: "About PerfAI: Technology Reseller & Partner",
    subheading:
      "PerfAI brings Senatria's Physical AI platform to commercial enterprises and infrastructure operators.",
  },
  resellerRole: {
    title: "Technology by Senatria. Deployment by PerfAI.",
    description:
      "Senatria develops the core Physical AI operating platform (ATRIA) and Shield applications. PerfAI acts as an authorised commercial partner, managing solution briefings, integration coordination, and ongoing technical support.",
  },
  engagementProcess: [
    {
      step: "01",
      title: "Infrastructure Assessment",
      summary:
        "Evaluating facility size, BMS compatibility, and historical energy performance.",
    },
    {
      step: "02",
      title: "Telemetry & Gateway Connection",
      summary:
        "Connecting on-site BMS and metering to the ATRIA edge gateway safely.",
    },
    {
      step: "03",
      title: "Operational Bounds Configuration",
      summary:
        "Defining site-specific governance boundaries and operator control preferences.",
    },
    {
      step: "04",
      title: "Ongoing Performance Support",
      summary:
        "Providing local engineering support, regular check-ins, and verified outcome reviews.",
    },
  ] as EngagementStep[],
};

