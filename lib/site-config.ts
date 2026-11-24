/**
 * Site Configuration & Placeholders
 *
 * Rules:
 * 1. Unverified credentials, emails, phones, and addresses are marked clearly as placeholders.
 * 2. Never invent facts, certifications, or statistics.
 */

export const siteConfig = {
  name: "PerfAI",
  brandDisplay: "PerfAI",
  domain: "https://perfai.in",
  tagline: "Channel partner for building management services.",
  logo: {
    light: "/images/brand/perfai-logo-light.jpg",
    dark: "/images/brand/perfai-logo-dark.jpg",
  },

  contact: {
    name: "Satheesh Tiptur",
    salesEmail: "satish@perfai.in",
    supportEmail: "satish@perfai.in",
    phone: "+91 95356 63909",
    phoneHref: "tel:+919535663909",
    address: {
      line1: "", // TODO(contact): Add registered office street address (footer shows the city only until then)
      city: "Bengaluru",
      region: "Karnataka",
      country: "India",
      postalCode: "560001",
    },
  },

  nav: [
    { label: "Home", href: "/#" },
    { label: "Why PerfAI", href: "/#why-perfai" },
    { label: "Management", href: "/management" },
    { label: "Contact Us", href: "/#demo" },
  ],
};
