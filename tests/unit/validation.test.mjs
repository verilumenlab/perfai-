import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { demoFormSchema, partnerFormSchema } from "../../lib/validation.ts";

describe("Validation Unit Tests", () => {
  describe("Demo Form Schema", () => {
    const validDemo = {
      fullName: "Jane Doe",
      businessEmail: "jane@enterprise.com",
      companyName: "Acme Holdings",
      jobTitle: "VP Facilities",
      phoneNumber: "+1 555 123 4567",
      country: "United States",
      industry: "Commercial Buildings",
      facilityType: "High-Rise Office",
      areaOfInterest: "BuildingShield (HVAC & BMS)",
      facilitySize: "400,000 sq ft",
      message: "Looking to deploy BuildingShield on central chillers.",
      privacyConsent: true,
      hp_website: "",
    };

    test("passes on valid demo payload", () => {
      const res = demoFormSchema.safeParse(validDemo);
      assert.strictEqual(res.success, true);
    });

    test("fails on invalid email", () => {
      const res = demoFormSchema.safeParse({ ...validDemo, businessEmail: "not-an-email" });
      assert.strictEqual(res.success, false);
      assert.ok(res.error.flatten().fieldErrors.businessEmail);
    });

    test("fails when consent is false", () => {
      const res = demoFormSchema.safeParse({ ...validDemo, privacyConsent: false });
      assert.strictEqual(res.success, false);
      assert.ok(res.error.flatten().fieldErrors.privacyConsent);
    });

    test("fails when honeypot is populated", () => {
      const res = demoFormSchema.safeParse({ ...validDemo, hp_website: "https://spam.org" });
      assert.strictEqual(res.success, false);
      assert.ok(res.error.flatten().fieldErrors.hp_website);
    });

    test("normalizes and trims whitespace and email casing", () => {
      const res = demoFormSchema.safeParse({
        ...validDemo,
        fullName: "   Jane Doe   ",
        businessEmail: "  JANE@ENTERPRISE.COM  ",
      });
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.data.fullName, "Jane Doe");
      assert.strictEqual(res.data.businessEmail, "jane@enterprise.com");
    });
  });

  describe("Partner Form Schema", () => {
    const validPartner = {
      fullName: "Marcus Vance",
      businessEmail: "m.vance@integrator.co.uk",
      companyName: "Vance BMS Integrations",
      jobTitle: "Managing Director",
      phoneNumber: "+44 20 7946 0192",
      country: "United Kingdom",
      industry: "Commercial Buildings",
      partnershipType: "BMS & Systems Integrator",
      message: "We integrate BACnet BMS systems across London commercial towers.",
      privacyConsent: true,
      hp_website: "",
    };

    test("passes on valid partner payload", () => {
      const res = partnerFormSchema.safeParse(validPartner);
      assert.strictEqual(res.success, true);
    });

    test("fails on unsupported partnership type", () => {
      const res = partnerFormSchema.safeParse({ ...validPartner, partnershipType: "Unauthorized Type" });
      assert.strictEqual(res.success, false);
      assert.ok(res.error.flatten().fieldErrors.partnershipType);
    });

    test("fails when message is shorter than 10 characters", () => {
      const res = partnerFormSchema.safeParse({ ...validPartner, message: "Hi" });
      assert.strictEqual(res.success, false);
      assert.ok(res.error.flatten().fieldErrors.message);
    });
  });
});
