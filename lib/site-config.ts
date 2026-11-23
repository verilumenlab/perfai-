/**
 * Site Configuration & Placeholders
 * 
 * Rules:
 * 1. Reseller verification is strictly controlled by RESELLER_VERIFIED flag.
 * 2. Unverified credentials, emails, phones, and addresses are marked clearly as placeholders.
 * 3. Never invent facts, certifications, or statistics.
 */

export const siteConfig = {
  name: "PerfAI",
  brandDisplay: "PerfAI | SENATRIA",
  domain: "https://perfai.in",
  partnerBrand: "SENATRIA",
  partnerUrl: "https://senatria.ai",

  // Set to true only once the reseller agreement is legally validated
  resellerVerified: false,

  get resellerBadge(): string {
    return this.resellerVerified
      ? "Official Reseller of SENATRIA"
      : "Authorised partner of SENATRIA";
  },

  get partnershipTagline(): string {
    return "Technology solutions powered by Senatria.";
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
    { label: "Home", href: "/" },
    { label: "Application", href: "/application" },
    { label: "Partner", href: "/partner" },
  ],
};
