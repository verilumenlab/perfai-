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
    salesEmail: "Business email (to be confirmed)", // TODO(contact): Confirm operational mailbox
    supportEmail: "Business support (to be confirmed)", // TODO(contact): Confirm operational mailbox
    phone: "Business phone (to be confirmed)", // TODO(contact): Replace placeholder business phone
    address: {
      line1: "Business address (to be confirmed)", // TODO(contact): Add registered office address
      city: "Bengaluru",
      region: "Karnataka",
      country: "India",
      postalCode: "560001",
    },
  },

  nav: [
    { label: "Home", href: "/#" },
    { label: "Why PerfAI", href: "/#why-perfai" },
    { label: "Contact Us", href: "/#demo" },
  ],
};
