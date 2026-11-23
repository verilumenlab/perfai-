import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
import assert from "assert";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

async function runVerification() {
  console.log("=== Starting Phase 6 Lead & Admin System Verification ===");

  // 1. Database check
  const adminCount = await prisma.adminUser.count();
  console.log(`[DB Check] Provisioned admin count: ${adminCount}`);
  assert(adminCount > 0, "At least one admin user must exist in the database");

  // 2. Direct API submission test for Demo Lead
  console.log("\n[Test 1] Testing Demo Lead API submission...");
  const testDemoPayload = {
    enquiryType: "DEMO",
    fullName: "Elena Rostova",
    businessEmail: "e.rostova@metrofacilities.com",
    companyName: "Metro Facilities Group",
    jobTitle: "VP Infrastructure",
    phoneNumber: "+44 20 7946 0192",
    country: "United Kingdom",
    industry: "Commercial Buildings",
    facilityType: "Grade-A Commercial Tower",
    areaOfInterest: "BuildingShield (HVAC & BMS)",
    facilitySize: "450,000 sq ft",
    message: "Seeking to optimize central chiller plant and integrate with existing BACnet BMS.",
    privacyConsent: true,
    hp_website: "",
    formLoadTime: Date.now() - 5000,
    sourcePage: "/#demo",
  };

  const demoRes = await fetch(`${BASE_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "10.0.0.1",
    },
    body: JSON.stringify(testDemoPayload),
  });

  const demoResult = await demoRes.json();
  console.log("[Test 1 Result]:", demoResult);
  assert.strictEqual(demoRes.status, 201, "Demo submission should return HTTP 201");
  assert.strictEqual(demoResult.success, true, "Demo submission result.success should be true");
  assert(demoResult.leadNumber.startsWith("PF-"), "Lead number must start with PF-");

  // Verify in database
  const createdLead = await prisma.lead.findUnique({
    where: { leadNumber: demoResult.leadNumber },
    include: { activities: true },
  });
  assert(createdLead, "Lead must be persisted in database");
  assert.strictEqual(createdLead.fullName, "Elena Rostova");
  assert.strictEqual(createdLead.activities.length, 1);
  console.log(`✅ Demo Lead created successfully with reference: ${createdLead.leadNumber}`);

  // 3. Honeypot check (bot submission should be discarded)
  console.log("\n[Test 2] Testing Honeypot anti-spam defense...");
  const spamPayload = {
    ...testDemoPayload,
    businessEmail: "spambot@spam.com",
    hp_website: "https://buy-cheap-stuff.xyz",
  };
  const spamRes = await fetch(`${BASE_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "10.0.0.2",
    },
    body: JSON.stringify(spamPayload),
  });
  const spamResult = await spamRes.json();
  assert.strictEqual(spamRes.status, 200, "Spam returns fake 200 to confuse bots");
  assert(spamResult.success, "Spam response success must be true");
  const spamInDb = await prisma.lead.findFirst({
    where: { businessEmail: "spambot@spam.com" },
  });
  assert(!spamInDb, "Spam submission must NOT be written to database");
  console.log("✅ Honeypot successfully trapped and discarded bot submission without database write.");

  // 4. Partner Enquiry Submission Test
  console.log("\n[Test 3] Testing Partner Enquiry API submission...");
  const testPartnerPayload = {
    enquiryType: "PARTNER",
    fullName: "Arjun Mehta",
    businessEmail: "arjun@apexrealestate.in",
    companyName: "Apex Real Estate Holdings",
    jobTitle: "Chief Technology Officer",
    phoneNumber: "+91 98765 43210",
    country: "India",
    industry: "Commercial Buildings",
    partnershipType: "Commercial Real Estate Portfolio",
    message: "Interested in deploying BuildingShield across our 12 commercial properties in Mumbai.",
    privacyConsent: true,
    hp_website: "",
    formLoadTime: Date.now() - 5000,
    sourcePage: "/partner",
  };

  const partnerRes = await fetch(`${BASE_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "10.0.0.3",
    },
    body: JSON.stringify(testPartnerPayload),
  });
  const partnerResult = await partnerRes.json();
  assert.strictEqual(partnerRes.status, 201, "Partner submission should return HTTP 201");
  console.log(`✅ Partner Lead created successfully with reference: ${partnerResult.leadNumber}`);

  // 4b. Explicit Rate Limiting Test
  console.log("\n[Test 3b] Testing In-Memory Sliding Window Rate Limiter (5 requests / min)...");
  const rateLimitIp = "10.0.0.99";
  let got429 = false;
  for (let i = 0; i < 7; i++) {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": rateLimitIp,
      },
      body: JSON.stringify({
        ...testPartnerPayload,
        businessEmail: `rate-limit-${i}@test.com`,
      }),
    });
    if (res.status === 429) {
      got429 = true;
      break;
    }
  }
  assert(got429, "Exceeding rate limit must trigger HTTP 429");
  console.log("✅ Rate limiter successfully blocked rapid submissions with HTTP 429.");

  // 5. Admin Authentication Test
  console.log("\n[Test 4] Testing Admin Authentication API...");
  // Bad credentials
  const badLoginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@perfai.in", password: "wrong-password" }),
  });
  assert.strictEqual(badLoginRes.status, 401, "Wrong password must be rejected with 401");

  // Valid credentials
  const goodLoginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `10.0.1.${Date.now() % 250}`,
    },
    body: JSON.stringify({ email: "admin@perfai.in", password: "AdminPlaceholder2026!" }),
  });
  assert.strictEqual(goodLoginRes.status, 200, "Valid login must return 200");
  const loginResult = await goodLoginRes.json();
  assert.strictEqual(loginResult.success, true);

  const cookieHeader = goodLoginRes.headers.get("set-cookie");
  assert(cookieHeader && cookieHeader.includes("perfai_admin_session"), "Session cookie must be set");
  const sessionTokenMatch = cookieHeader.match(/perfai_admin_session=([^;]+)/);
  const sessionCookie = sessionTokenMatch ? sessionTokenMatch[0] : "";
  console.log("✅ Admin authentication succeeded, session cookie received.");

  // 6. Admin Leads API with authenticated session
  console.log("\n[Test 5] Testing Admin Leads List API...");
  const adminLeadsRes = await fetch(`${BASE_URL}/api/admin/leads`, {
    headers: { Cookie: sessionCookie },
  });
  assert.strictEqual(adminLeadsRes.status, 200, "Admin leads API must return 200");
  const adminLeadsData = await adminLeadsRes.json();
  assert(adminLeadsData.leads.length >= 2, "Must return at least 2 leads");
  console.log(`✅ Admin Leads API returned ${adminLeadsData.leads.length} leads. Stats:`, adminLeadsData.stats);

  // 7. Lead Update & Notes (PATCH)
  console.log("\n[Test 6] Testing Lead status, priority update and internal note...");
  const targetLead = adminLeadsData.leads[0];
  const patchRes = await fetch(`${BASE_URL}/api/admin/leads/${targetLead.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionCookie,
    },
    body: JSON.stringify({
      status: "QUALIFIED",
      priority: "HIGH",
      newNote: "Initial discovery call conducted. Facility BMS compatibility confirmed.",
    }),
  });
  assert.strictEqual(patchRes.status, 200, "PATCH lead must return 200");
  const patchResult = await patchRes.json();
  assert.strictEqual(patchResult.lead.status, "QUALIFIED");
  assert.strictEqual(patchResult.lead.priority, "HIGH");
  assert(patchResult.lead.notes.length >= 1, "Notes must contain the newly added note");
  assert(patchResult.lead.activities.length >= 2, "Activity log must track the status change & note");
  console.log("✅ Lead updated to QUALIFIED / HIGH with internal note and audit activity recorded.");

  // 8. CSV Export Test (including Formula Injection Sanity)
  console.log("\n[Test 7] Testing CSV Export & Formula Injection Escaping...");
  // Clean up any previous test formula leads
  await prisma.lead.deleteMany({ where: { businessEmail: "formula@test.com" } });

  // Inject a lead with potential formula injection
  const formulaLead = await prisma.lead.create({
    data: {
      leadNumber: `PF-${Date.now()}`,
      enquiryType: "DEMO",
      fullName: "=cmd|' /C calc'!A0",
      businessEmail: "formula@test.com",
      companyName: "@MaliciousCorp",
      jobTitle: "+Exec",
      country: "Testing",
      industry: "Other",
      message: "-100% discount requested",
      privacyConsent: true,
      status: "NEW",
    },
  });

  const exportRes = await fetch(`${BASE_URL}/api/admin/leads/export`, {
    headers: { Cookie: sessionCookie },
  });
  assert.strictEqual(exportRes.status, 200);
  const csvText = await exportRes.text();
  assert(csvText.includes("Lead Ref,Type,Created At"), "CSV header must be present");
  assert(csvText.includes("\"'=cmd"), "Formula starting with = must be escaped with single quote");
  assert(csvText.includes("\"'@MaliciousCorp"), "Formula starting with @ must be escaped with single quote");
  assert(csvText.includes("\"'+Exec"), "Formula starting with + must be escaped with single quote");
  assert(csvText.includes("\"'-100%"), "Formula starting with - must be escaped with single quote");
  console.log("✅ CSV Export successfully sanitized all formula injection characters (=, @, +, -).");

  // Clean up formula test lead
  await prisma.lead.delete({ where: { id: formulaLead.id } });

  // 9. Playwright Browser E2E Test (Unauthenticated Redirect & Admin Dashboard UI)
  console.log("\n[Test 8] Testing Browser E2E navigation...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Test unauthenticated redirect
  await page.goto(`${BASE_URL}/admin`);
  await page.waitForURL("**/admin/login**");
  console.log("✅ Unauthenticated access to /admin properly redirects to /admin/login.");

  // Perform login via UI
  await page.fill("#admin_email", "admin@perfai.in");
  await page.fill("#admin_password", "AdminPlaceholder2026!");
  await page.click("button[type='submit']");
  await page.waitForURL("**/admin");
  console.log("✅ Browser UI login succeeded and routed into /admin dashboard.");

  // Verify dashboard elements
  await page.waitForSelector("table tbody tr");
  const rowCount = await page.locator("table tbody tr").count();
  console.log(`✅ Admin Dashboard rendered ${rowCount} lead rows.`);

  await browser.close();

  console.log("\n=======================================================");
  console.log("🎉 ALL PHASE 6 VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  console.log("=======================================================\n");
}

runVerification()
  .catch((e) => {
    console.error("❌ Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
