import { z } from "zod";

export const INDUSTRY_OPTIONS = [
  "Commercial Buildings",
  "Hospitality",
  "Data Centres",
  "Industrial Infrastructure",
  "Energy & Grid",
  "Other",
] as const;

export const AREA_OF_INTEREST_OPTIONS = [
  "ATRIA Platform Core",
  "BuildingShield (HVAC & BMS)",
  "GridShield (Energy & Microgrid)",
  "ComputeShield (Edge Infrastructure)",
  "VERITAS (Verification Ledger)",
  "Full Physical AI Suite",
] as const;

export const PARTNERSHIP_TYPE_OPTIONS = [
  "Facility Owner / Enterprise Operator",
  "Commercial Real Estate Portfolio",
  "BMS & Systems Integrator",
  "Technology & Hardware Vendor",
  "Other Business Enquiry",
] as const;

// Common sanitized string validator
const sanitizedString = (min: number, max: number, label: string) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(min, { message: `${label} must be at least ${min} character${min > 1 ? "s" : ""}` })
    .max(max, { message: `${label} must not exceed ${max} characters` });

export const demoFormSchema = z.object({
  fullName: sanitizedString(2, 80, "Full name"),
  businessEmail: z
    .string({ message: "Business email is required" })
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(120, { message: "Email must not exceed 120 characters" })
    .toLowerCase(),
  companyName: sanitizedString(2, 100, "Company name"),
  jobTitle: sanitizedString(2, 80, "Job title"),
  phoneNumber: z
    .string()
    .trim()
    .max(25, { message: "Phone number is too long" })
    .optional()
    .or(z.literal("")),
  country: sanitizedString(2, 60, "Country"),
  industry: z.enum(INDUSTRY_OPTIONS, {
    message: "Please select an industry",
  }),
  facilityType: z
    .string()
    .trim()
    .max(80, { message: "Facility type is too long" })
    .optional()
    .or(z.literal("")),
  areaOfInterest: z.enum(AREA_OF_INTEREST_OPTIONS, {
    message: "Please select an area of interest",
  }),
  facilitySize: z
    .string()
    .trim()
    .max(60, { message: "Facility size is too long" })
    .optional()
    .or(z.literal("")),
  message: sanitizedString(10, 2000, "Requirements or message"),
  privacyConsent: z.literal(true, {
    message: "You must consent to the privacy policy to proceed",
  }),
  // Anti-spam honeypot (must be empty)
  hp_website: z.string().max(0, { message: "Spam submission detected" }).optional().or(z.literal("")),
  // Timestamp token for minimum time-to-submit verification (ms)
  formLoadTime: z.number().optional(),
  // Tracking
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export type DemoFormData = z.infer<typeof demoFormSchema>;

export const partnerFormSchema = z.object({
  fullName: sanitizedString(2, 80, "Full name"),
  businessEmail: z
    .string({ message: "Business email is required" })
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(120, { message: "Email must not exceed 120 characters" })
    .toLowerCase(),
  companyName: sanitizedString(2, 100, "Company name"),
  jobTitle: sanitizedString(2, 80, "Job title"),
  phoneNumber: z
    .string()
    .trim()
    .max(25, { message: "Phone number is too long" })
    .optional()
    .or(z.literal("")),
  country: sanitizedString(2, 60, "Country"),
  industry: z.enum(INDUSTRY_OPTIONS, {
    message: "Please select your primary industry",
  }),
  partnershipType: z.enum(PARTNERSHIP_TYPE_OPTIONS, {
    message: "Please select a partnership type",
  }),
  message: sanitizedString(10, 2000, "Collaboration overview or message"),
  privacyConsent: z.literal(true, {
    message: "You must consent to the privacy policy to proceed",
  }),
  // Anti-spam honeypot (must be empty)
  hp_website: z.string().max(0, { message: "Spam submission detected" }).optional().or(z.literal("")),
  // Timestamp token
  formLoadTime: z.number().optional(),
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;
