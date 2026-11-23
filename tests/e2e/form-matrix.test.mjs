import { chromium } from "playwright";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { PrismaClient } from "@prisma/client";

describe("Enquiry Forms Matrix & Attribution Tracking Verification", () => {
  let browser;
  const prisma = new PrismaClient();
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

  const TEST_EMAILS = [
    "elena.vance@blackmesa-facility.com",
    "bot@spammer.com",
    "siddharth.rao@apexenergy.in",
  ];

  async function cleanupTestData() {
    await prisma.leadActivity.deleteMany({
      where: { lead: { businessEmail: { in: TEST_EMAILS } } },
    }).catch(() => {});
    await prisma.leadNote.deleteMany({
      where: { lead: { businessEmail: { in: TEST_EMAILS } } },
    }).catch(() => {});
    await prisma.lead.deleteMany({
      where: { businessEmail: { in: TEST_EMAILS } },
    }).catch(() => {});
  }

  before(async () => {
    browser = await chromium.launch({ headless: true });
    // Clean up any stale test records from previous runs
    await cleanupTestData();
  });

  after(async () => {
    if (browser) await browser.close();
    await cleanupTestData();
    await prisma.$disconnect();
  });

  it("submits valid Demo form with UTM parameters and records attribution in database", async () => {
    const page = await browser.newPage();
    const utmUrl = `${BASE_URL}/?utm_source=qa_test&utm_medium=automation&utm_campaign=rc_audit#demo`;
    await page.goto(utmUrl, { waitUntil: "domcontentloaded" });

    // Scroll form into view
    const form = page.locator("form[aria-label*='demonstration']");
    await form.scrollIntoViewIfNeeded();

    // Fill the demo form with all required fields (including message >= 10 chars)
    await page.fill("#fullName", "Dr. Elena Vance");
    await page.fill("#businessEmail", "elena.vance@blackmesa-facility.com");
    await page.fill("#companyName", "Black Mesa Research");
    await page.fill("#jobTitle", "Facility Director");
    await page.fill("#country", "United States");
    await page.fill("#phoneNumber", "+1 555-0199");
    await page.selectOption("#industry", "Data Centres");
    await page.selectOption("#areaOfInterest", "ComputeShield (Edge Infrastructure)");
    await page.fill("#facilitySize", "45,000 sq ft");
    await page.fill("#message", "Seeking to optimize central chiller plant and cooling loops with Physical AI.");
    await page.check("#privacyConsent");

    // Wait slightly to satisfy time-to-submit anti-bot guard (> 1.5s)
    await page.waitForTimeout(2000);

    // Submit form via form-scoped submit button
    const submitBtn = form.locator("button[type='submit']");
    await submitBtn.click();

    // Expect success message
    await page.waitForSelector("text=Demonstration Request Registered", { timeout: 15000 });
    const successText = await page.textContent("body");
    assert(successText?.includes("Reference:"), "Success panel must display reference code");

    // Retrieve lead directly by business email
    const lead = await prisma.lead.findFirst({
      where: { businessEmail: "elena.vance@blackmesa-facility.com" },
    });

    assert(lead !== null, "Demo lead must be persisted in database");
    assert.strictEqual(lead.businessEmail, "elena.vance@blackmesa-facility.com");
    assert.strictEqual(lead.companyName, "Black Mesa Research");
    assert.strictEqual(lead.enquiryType, "DEMO");
    assert.strictEqual(lead.utmSource, "qa_test");
    assert.strictEqual(lead.utmMedium, "automation");
    assert.strictEqual(lead.utmCampaign, "rc_audit");

    await page.close();
  });

  it("rejects demo submission when honeypot field is filled", async () => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/#demo`, { waitUntil: "domcontentloaded" });

    const form = page.locator("form[aria-label*='demonstration']");
    await form.scrollIntoViewIfNeeded();

    await page.fill("#fullName", "Spam Bot");
    await page.fill("#businessEmail", "bot@spammer.com");
    await page.fill("#companyName", "Spam Corp");
    await page.fill("#jobTitle", "Automator");
    await page.fill("#country", "Unknown");
    await page.fill("#message", "This is spam message content.");
    await page.check("#privacyConsent");

    // Fill hidden honeypot using Playwright's force fill so React Hook Form registers the value
    await page.locator("#hp_website_demo").fill("http://spam-link.com", { force: true });

    await page.waitForTimeout(1800);
    const submitBtn = form.locator("button[type='submit']");
    await submitBtn.click();

    await page.waitForTimeout(1500);
    const lead = await prisma.lead.findFirst({
      where: { businessEmail: "bot@spammer.com" },
    });
    assert.strictEqual(lead, null, "Honeypot submission must not create a database record");

    await page.close();
  });

  it("validates required fields and email format before network dispatch", async () => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/#demo`, { waitUntil: "domcontentloaded" });

    const form = page.locator("form[aria-label*='demonstration']");
    await form.scrollIntoViewIfNeeded();

    // Submit with empty inputs
    const submitBtn = form.locator("button[type='submit']");
    await submitBtn.click();

    // Check that validation message appears
    await page.waitForSelector("#fullName-error", { state: "visible", timeout: 5000 });
    const nameErr = await page.textContent("#fullName-error");
    assert(nameErr?.includes("Full name") || nameErr?.includes("required"), "Must show name validation error");

    await page.fill("#fullName", "Valid Name");
    await page.fill("#businessEmail", "invalid-not-an-email");
    await submitBtn.click();

    await page.waitForSelector("#businessEmail-error", { state: "visible", timeout: 5000 });
    const emailErr = await page.textContent("#businessEmail-error");
    assert(emailErr?.includes("valid email"), "Must show invalid email error");

    await page.close();
  });

  it("submits valid Partner application on /partner", async () => {
    const page = await browser.newPage();
    const utmUrl = `${BASE_URL}/partner?utm_source=partner_portal&utm_campaign=apac#partner-form`;
    await page.goto(utmUrl, { waitUntil: "domcontentloaded" });

    const form = page.locator("form[aria-label*='Partnership']");
    await form.scrollIntoViewIfNeeded();

    await page.fill("#p_fullName", "Siddharth Rao");
    await page.fill("#p_businessEmail", "siddharth.rao@apexenergy.in");
    await page.fill("#p_companyName", "Apex Energy Solutions");
    await page.fill("#p_jobTitle", "Managing Director");
    await page.fill("#p_country", "India");
    await page.fill("#p_phoneNumber", "+91 98765 43210");
    await page.selectOption("#p_partnershipType", "BMS & Systems Integrator");
    await page.fill(
      "#p_message",
      "We are an established regional BMS systems integrator interested in deploying Senatria Physical AI across commercial facilities."
    );
    await page.check("#p_privacyConsent");

    await page.waitForTimeout(2000);
    const submitBtn = form.locator("button[type='submit']");
    await submitBtn.click();

    await page.waitForSelector("text=Partnership Enquiry Registered", { timeout: 15000 });
    const successText = await page.textContent("body");
    assert(successText?.includes("Reference:"), "Success panel must display reference code");

    const lead = await prisma.lead.findFirst({
      where: { businessEmail: "siddharth.rao@apexenergy.in" },
    });
    assert(lead !== null, "Partner lead must be saved in database");
    assert.strictEqual(lead.enquiryType, "PARTNER");
    assert.strictEqual(lead.businessEmail, "siddharth.rao@apexenergy.in");
    assert.strictEqual(lead.utmSource, "partner_portal");

    await page.close();
  });
});
