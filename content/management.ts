/**
 * MD leadership page content.
 * Personal identity fields marked as placeholders until confirmed.
 */

import { siteConfig } from "@/lib/site-config";

export const managementPage = {
  meta: {
    title: "MD",
    description:
      "Meet the leadership behind PerfAI — driving innovation and excellence in Building Management Services.",
  },

  quote: {
    title: "Leadership Behind PerfAI",
    text: "Driving innovation, building smarter environments and delivering excellence in Building Management Services.",
  },

  profile: {
    fullName: siteConfig.contact.name,
    designation: "MD",
    /** Professional portrait served from public/images/team/ */
    photo: "/images/team/manager.jpg",
    photoReady: true,
    photoAlt: "Professional portrait — MD, PerfAI",
    introduction:
      "As MD, leading PerfAI with a focus on customer engagement, disciplined delivery and long-term partnerships in Building Management Services.",
  },

  company: {
    eyebrow: "About the Company",
    heading: "PerfAI at a glance",
    about: {
      title: "About PerfAI",
      text: "PerfAI is a channel partner for building management services. We help commercial building operators, facility managers and infrastructure teams evaluate and adopt BMS solutions that fit their sites — from first briefing through deployment coordination and ongoing support.",
    },
    vision: {
      title: "Vision",
      text: "Buildings that run smarter, use energy more efficiently, and stay under clear operational control — supported by partners who understand real facility constraints.",
    },
    mission: {
      title: "Mission",
      text: "Connect organisations with the right building management services through focused customer engagement, practical scoping and reliable commercial coordination.",
    },
    bms: {
      title: "Building Management Services",
      text: "PerfAI coordinates BMS-related offerings across HVAC control, energy monitoring, systems integration and day-to-day facility operations — matched to how buildings actually run.",
      pillars: [
        "HVAC Management",
        "Energy Monitoring",
        "BMS Integration",
        "Facility Operations",
      ],
    },
    partnership: {
      title: "Open for Business Partnerships",
      text: "PerfAI welcomes business and technology partnerships. We collaborate with technology providers, solution partners, and industry experts to bring innovative Physical AI capabilities to customers through strategic partnerships, technology integration, and coordinated solution delivery.",
    },
  },

  person: {
    eyebrow: "About the Person",
    heading: "Role and responsibilities",
    intro:
      "The MD steers how PerfAI engages customers, scopes opportunities and coordinates delivery with technical partners.",
    responsibilities: [
      {
        title: "Customer engagement",
        text: "Own discovery conversations with facility directors and engineering teams, clarifying operational needs and commercial fit.",
      },
      {
        title: "Solution scoping",
        text: "Translate site constraints into clear BMS service scopes across HVAC, energy, integration and facility operations.",
      },
      {
        title: "Delivery coordination",
        text: "Align PerfAI commercial activity with technical partners from preliminary review through go-live follow-up.",
      },
      {
        title: "Partnership stewardship",
        text: "Maintain the channel relationship with Senatria and ensure public positioning stays accurate and customer-first.",
      },
      {
        title: "Operational excellence",
        text: "Set engagement standards, response discipline and continuous improvement across PerfAI’s client workflows.",
      },
    ],
  },

  contact: {
    eyebrow: "Connect",
    heading: "Contact & professional links",
    text: "Reach the MD’s office for partnership discussions, facility briefings or commercial enquiries.",
    email: siteConfig.contact.salesEmail,
    /** TODO(leadership): Add official LinkedIn profile URL */
    linkedIn: {
      label: "LinkedIn profile",
      href: "#",
      ready: false,
    },
    primaryCta: { label: "Contact Us", href: "/#demo" },
  },
} as const;
