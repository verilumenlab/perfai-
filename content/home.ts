// Home page copy for PerfAI — channel partner for building management services.

export const hero = {
  lines: ["Make Your Buildings", "Smarter. More Efficient.", "Better Managed."],
  accentLineIndex: 2,
  sub: "PerfAI is your channel partner for building management services — helping facilities teams select, deploy and support BMS solutions that fit real operations.",
  primary: { label: "Contact Us", href: "/#demo" },
  secondary: { label: "Why PerfAI", href: "/#why-perfai" },
};

export type Product = { name: string; line: string };

export const products: Product[] = [
  { name: "HVAC Control", line: "Comfort and plant efficiency" },
  { name: "Energy Monitoring", line: "Meters, tariffs and peak load" },
  { name: "BMS Integration", line: "Connect existing building systems" },
  { name: "Facility Operations", line: "Day-to-day building performance" },
];

export const technology = {
  heading: "Building Management That Fits Your Site.",
  intro:
    "PerfAI works with facility owners and operators to introduce the right building management services — from HVAC and energy monitoring to integrated BMS control — matched to how your buildings actually run.",
  loopCaption: "A practical operating cycle for managed buildings.",
  loop: ["Assess", "Specify", "Integrate", "Operate", "Monitor", "Improve"],
  loopCenter: "BMS",
  concepts: [
    {
      title: "Building Management Systems",
      text: "Central control of HVAC, lighting, metering and related plant through a coordinated BMS layer.",
    },
    {
      title: "Energy & Comfort",
      text: "Balance occupant comfort with energy use, peak demand and equipment runtime.",
    },
    {
      title: "Systems Integration",
      text: "Connect existing controllers, meters and site systems without forcing a rip-and-replace.",
    },
    {
      title: "Operational Visibility",
      text: "Clear views of how buildings are performing so teams can act with confidence.",
    },
    {
      title: "Channel Partnership",
      text: "PerfAI brings building management services to market as a dedicated channel partner.",
    },
    {
      title: "Ongoing Support",
      text: "Coordination after go-live so your facility team is not left alone with a new stack.",
    },
  ],
  linkLabel: "Talk to our team",
  linkHref: "/#demo",
};

export type IndustryKey =
  | "commercial"
  | "hospitality"
  | "datacentres"
  | "industrial"
  | "energy";

export const industries: {
  key: IndustryKey;
  title: string;
  text: string;
  image: string | null;
  href: string;
}[] = [
  {
    key: "commercial",
    title: "Commercial Buildings",
    text: "Offices and mixed-use buildings with complex HVAC and building systems.",
    image: null,
    href: "/#demo",
  },
  {
    key: "hospitality",
    title: "Hospitality",
    text: "Hotels and resorts where comfort and energy use both matter.",
    image: null,
    href: "/#demo",
  },
  {
    key: "datacentres",
    title: "Data Centres",
    text: "Sites where power and cooling headroom limit growth.",
    image: null,
    href: "/#demo",
  },
  {
    key: "industrial",
    title: "Industrial Infrastructure",
    text: "Plants and facilities with heavy, continuous loads.",
    image: null,
    href: "/#demo",
  },
  {
    key: "energy",
    title: "Energy & Utilities",
    text: "Sites that need tighter visibility of load and building demand.",
    image: null,
    href: "/#demo",
  },
];

export const why = {
  heading: "Your Channel Partner for Building Management.",
  points: [
    {
      title: "Channel focus",
      text: "We specialise in bringing building management services to commercial and facility customers.",
    },
    {
      title: "Customer engagement",
      text: "From first briefing to deployment coordination, you deal with one PerfAI team.",
    },
    {
      title: "Site-first approach",
      text: "We start from your building systems, BMS landscape and operational requirements.",
    },
    {
      title: "Local and responsive",
      text: "Dedicated business support for the customers we work with.",
    },
  ],
};

export const howItWorks = {
  eyebrow: "How it works",
  heading: "From application to first project in four steps",
  steps: [
    {
      step: "01",
      title: "Apply",
      text: "Fill in the short form below with your company details.",
    },
    {
      step: "02",
      title: "Meet your channel manager",
      text: "A quick call to understand your business, region and goals.",
    },
    {
      step: "03",
      title: "Sign & onboard",
      text: "Sign the partner agreement and get portal access and pricing.",
    },
    {
      step: "04",
      title: "Train & sell",
      text: "Certify your engineers and register your first opportunity.",
    },
  ],
};

export const partnerTiers = {
  heading: "Grow at your own pace",
  text: "Start as a Registered partner and move up as you certify engineers and close projects.",
  tiers: [
    {
      key: "registered",
      name: "Registered",
      blurb: "For firms starting out with BMS projects.",
      discountLabel: "15%",
      discountNote: "partner discount on list price",
      featured: false,
      features: [
        "Partner portal & price list",
        "Online foundation training",
        "Deal registration",
        "Standard technical support",
      ],
      requirement: "Requirement: Company registration and one trained engineer",
    },
    {
      key: "certified",
      name: "Certified",
      blurb: "For integrators delivering projects regularly.",
      discountLabel: "25%",
      discountNote: "partner discount on list price",
      featured: true,
      badge: "Most popular",
      features: [
        "Everything in Registered",
        "Classroom certification",
        "Pre-sales engineering support",
        "Demo kit at partner price",
        "Listing on partner locator",
      ],
      requirement: "Requirement: 2 certified engineers and 5 projects / year",
    },
    {
      key: "premier",
      name: "Premier",
      blurb: "For leading partners with regional reach.",
      discountLabel: "35%",
      discountNote: "partner discount on list price",
      featured: false,
      features: [
        "Everything in Certified",
        "Dedicated channel manager",
        "Co-marketing funds",
        "Priority escalation & site support",
        "Early access to new products",
      ],
      requirement: "Requirement: 4 certified engineers and ₹50L annual business",
    },
  ],
};

export const partnerBenefits = {
  heading: "Everything you need to win and deliver BMS projects",
  text: "From the first site survey to the annual maintenance contract, we back you with product, people and pricing.",
  items: [
    {
      key: "margins",
      title: "Protected margins",
      text: "Tiered partner discounts and deal registration so the projects you find stay yours.",
    },
    {
      key: "training",
      title: "Certified training",
      text: "Hands-on programming, commissioning and integration courses for your engineers.",
    },
    {
      key: "presales",
      title: "Pre-sales engineering",
      text: "Our application engineers help with BOQs, I/O schedules, schematics and tender specs.",
    },
    {
      key: "demo",
      title: "Demo kits & site visits",
      text: "Discounted demo panels and joint customer visits to help you close faster.",
    },
    {
      key: "marketing",
      title: "Co-marketing funds",
      text: "Support for events, case studies and campaigns in your region.",
    },
    {
      key: "support",
      title: "Priority technical support",
      text: "A dedicated partner helpline and escalation path for live projects.",
    },
  ],
};

export const faq = {
  eyebrow: "FAQ",
  heading: "Questions partners ask",
  text: "Quick answers about contacting PerfAI, demos and the partner programme.",
  items: [
    {
      q: "How do I contact PerfAI?",
      a: "Use the Contact Us form at the bottom of this page. Share your company details and whether you need a demo or a partnership conversation — our team will follow up.",
    },
    {
      q: "What should I include in the Contact Us form?",
      a: "Your name, work email, company, role, country and a short note on your building or partnership interest. Optional phone and facility size help us prepare a better reply.",
    },
    {
      q: "How fast will someone respond?",
      a: "We aim to respond within one business day for Contact Us submissions. Urgent live-project support is prioritised for Certified and Premier partners.",
    },
    {
      q: "Can I request a demo and a partnership chat in one form?",
      a: "Yes. Submit once via Contact Us and choose the closest area of interest — including Partnership / Channel Enquiry if that is your primary goal.",
    },
    {
      q: "Who is the Contact Us form for?",
      a: "Facility owners, operators, BMS integrators and companies exploring PerfAI as a channel partner for building management services.",
    },
    {
      q: "Is there another way to reach you besides the form?",
      a: "The Contact Us section also lists our direct inquiries email for corporate procurement and official correspondence. Prefer the form for the fastest routing.",
    },
  ],
};

export const cta = {
  heading: "Let's talk about your building.",
  text: "Whether you want a BMS demonstration or a partnership conversation, tell us about your facility and we will follow up.",
  bullets: [
    "Demonstrations for facility owners and operations teams",
    "Partnership and channel conversations for integrators and portfolios",
    "Coordination across HVAC, energy monitoring and BMS integration",
  ],
};

/** Compatibility alias for ProductStrip and older callers. */
export const homeContent = {
  hero: {
    headline: hero.lines.join(" "),
    supportingText: hero.sub,
    ctaPrimary: hero.secondary.label,
    ctaSecondary: hero.primary.label,
  },
  products: products.map((p) => ({
    name: p.name,
    role: p.line,
    description: p.line,
  })),
  technology: {
    heading: technology.heading,
    description: technology.intro,
    concepts: technology.concepts.map((c, i) => ({
      id: `concept-${i}`,
      name: c.title,
      title: c.title,
      summary: c.text,
    })),
  },
};
