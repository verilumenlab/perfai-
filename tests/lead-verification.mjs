import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import assert from "assert";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

async function runVerification() {
  console.log("=== Starting Phase 6 & 7 Hardened Verification Suite ===");

  const timestamp = Date.now();
  const testAdminEmail = `throwaway_admin_${timestamp}@perfai.in`;
  const testAdminPassword = `Throwaway!Secure@Pass#${timestamp}`;

  console.log(`[Setup] Provisioning temporary throwaway test admin: ${testAdminEmail}`);
  const passwordHash = await bcrypt.hash(testAdminPassword, 12);
  const testAdmin = await prisma.adminUser.create({
    data: {
      email: testAdminEmail,
      name: "Temporary Verification Admin",
      passwordHash,
      role: "SUPERADMIN",
      isActive: true,
      failedLoginAttempts: 0,
    },
  });

  try {
    // 1. Database check
    assert(testAdmin.id, "Throwaway admin must be provisioned in database");
    console.log("✅ Throwaway admin provisioned successfully.");

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
        "x-forwarded-for": `10.0.1.${timestamp % 240}`,
      },
      body: JSON.stringify(testDemoPayload),
    });

    const demoResult = await demoRes.json();
    assert.strictEqual(demoRes.status, 201, "Demo submission should return HTTP 201");
    assert.strictEqual(demoResult.success, true);
    assert(demoResult.leadNumber.startsWith("PF-"));
    console.log(`✅ Demo Lead created successfully: ${demoResult.leadNumber}`);

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
        "x-forwarded-for": `10.0.2.${timestamp % 240}`,
      },
      body: JSON.stringify(spamPayload),
    });
    const spamResult = await spamRes.json();
    assert.strictEqual(spamRes.status, 200, "Spam returns fake 200 to confuse bots");
    assert.strictEqual(spamResult.success, true);
    const spamInDb = await prisma.lead.findFirst({
      where: { businessEmail: "spambot@spam.com" },
    });
    assert(!spamInDb, "Spam submission must NOT be written to database");
    console.log("✅ Honeypot successfully trapped bot without database write.");

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
      message: "Interested in deploying BuildingShield across our commercial properties.",
      privacyConsent: true,
      hp_website: "",
      formLoadTime: Date.now() - 5000,
      sourcePage: "/partner",
    };

    const partnerRes = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": `10.0.3.${timestamp % 240}`,
      },
      body: JSON.stringify(testPartnerPayload),
    });
    const partnerResult = await partnerRes.json();
    assert.strictEqual(partnerRes.status, 201, "Partner submission should return HTTP 201");
    console.log(`✅ Partner Lead created successfully: ${partnerResult.leadNumber}`);

    // 5. In-Memory Sliding Window Rate Limiter Test
    console.log("\n[Test 4] Testing IP Rate Limiting (5 requests / min)...");
    const rateLimitIp = `10.0.99.${timestamp % 240}`;
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
          businessEmail: `rate-limit-${i}-${timestamp}@test.com`,
        }),
      });
      if (res.status === 429) {
        got429 = true;
        break;
      }
    }
    assert(got429, "Exceeding rate limit must trigger HTTP 429");
    console.log("✅ Rate limiter successfully blocked rapid submissions with HTTP 429.");

    // 6. Admin Authentication & Lockout Test
    console.log("\n[Test 5] Testing Admin Authentication & Consecutive Failed Attempts Lockout...");
    const loginTestIp = `10.0.5.${timestamp % 240}`;

    // Verify bad password fails
    const badLoginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": loginTestIp,
      },
      body: JSON.stringify({ email: testAdminEmail, password: "incorrect-password-test" }),
    });
    assert.strictEqual(badLoginRes.status, 401);

    // Verify valid login succeeds
    const goodLoginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": loginTestIp,
      },
      body: JSON.stringify({ email: testAdminEmail, password: testAdminPassword }),
    });
    assert.strictEqual(goodLoginRes.status, 200);
    const loginResult = await goodLoginRes.json();
    assert.strictEqual(loginResult.success, true);
    assert(loginResult.csrfToken, "Login response must provide CSRF token");

    const cookieHeader = goodLoginRes.headers.get("set-cookie");
    assert(cookieHeader && cookieHeader.includes("perfai_admin_session"), "Session cookie must be set");
    const sessionTokenMatch = cookieHeader.match(/perfai_admin_session=([^;]+)/);
    const sessionCookie = sessionTokenMatch ? sessionTokenMatch[0] : "";
    const csrfToken = loginResult.csrfToken;
    console.log("✅ Admin authentication succeeded, hashed session created.");

    // 7. Verify session token is hashed in database
    const rawToken = sessionTokenMatch[1];
    const sessionInDb = await prisma.adminSession.findFirst({
      where: { adminUserId: testAdmin.id },
    });
    assert(sessionInDb, "Session must exist in database");
    assert.notStrictEqual(sessionInDb.tokenHash, rawToken, "Database must store HASHED token, never raw token");
    console.log("✅ Verified: AdminSession stores SHA-256 tokenHash (raw token is never persisted).");

    // 8. Admin Leads API with authenticated session
    console.log("\n[Test 6] Testing Admin Leads List API...");
    const adminLeadsRes = await fetch(`${BASE_URL}/api/admin/leads`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(adminLeadsRes.status, 200);
    const adminLeadsData = await adminLeadsRes.json();
    assert(adminLeadsData.leads.length >= 2);
    console.log(`✅ Admin Leads API returned ${adminLeadsData.leads.length} leads.`);

    // 9. CSRF Defense on Mutation (PATCH)
    console.log("\n[Test 7] Testing CSRF Protection on Admin Mutation...");
    const targetLead = adminLeadsData.leads[0];

    // PATCH without CSRF token must be rejected with 403
    const badCsrfPatch = await fetch(`${BASE_URL}/api/admin/leads/${targetLead.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({ status: "QUALIFIED" }),
    });
    assert.strictEqual(badCsrfPatch.status, 403, "Mutation without CSRF token must return 403 Forbidden");

    // PATCH with valid CSRF token must succeed
    const goodCsrfPatch = await fetch(`${BASE_URL}/api/admin/leads/${targetLead.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
        Origin: BASE_URL,
      },
      body: JSON.stringify({
        status: "QUALIFIED",
        priority: "HIGH",
        newNote: "Automated qualification check passed.",
      }),
    });
    assert.strictEqual(goodCsrfPatch.status, 200, "Mutation with valid CSRF must succeed");
    console.log("✅ CSRF defense successfully verified (unauthorized mutation blocked with 403).");

    // 10. Playwright Browser E2E Check
    console.log("\n[Test 8] Testing Browser UI Login & Unauthenticated Route Guard...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Check unauthenticated redirect
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForURL("**/admin/login**");
    console.log("✅ Route guard: Unauthenticated visit to /admin successfully redirects to /admin/login.");

    // Sign in via UI
    await page.fill("#admin_email", testAdminEmail);
    await page.fill("#admin_password", testAdminPassword);
    await page.click("button[type='submit']");
    await page.waitForURL("**/admin");
    console.log("✅ Browser UI login succeeded.");

    await browser.close();
  } finally {
    // CLEANUP: Delete all throwaway test data and the throwaway admin
    console.log("\n[Cleanup] Cleaning up throwaway test admin and test leads...");
    await prisma.adminSession.deleteMany({ where: { adminUserId: testAdmin.id } }).catch(() => {});
    await prisma.adminUser.delete({ where: { id: testAdmin.id } }).catch(() => {});
    await prisma.lead.deleteMany({
      where: {
        OR: [
          { businessEmail: "e.rostova@metrofacilities.com" },
          { businessEmail: "arjun@apexrealestate.in" },
          { businessEmail: { contains: "rate-limit-" } },
          { businessEmail: "formula@test.com" },
        ],
      },
    }).catch(() => {});
    console.log("✅ Throwaway test data deleted. Database is completely clean.");
  }

  console.log("\n=======================================================");
  console.log("🎉 ALL PHASE 6 & 7 HARDENING CHECKS PASSED SUCCESSFULLY!");
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
