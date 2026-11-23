import { chromium } from "playwright";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

describe("Admin Console & Lead Management Security Matrix", () => {
  let browser;
  const prisma = new PrismaClient();
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

  let testAdmin;
  const testAdminEmail = `qa-admin-${Date.now()}@perfai.in`;
  const testAdminPassword = "SecurePass-QA-2026!#";
  let testLead;

  before(async () => {
    browser = await chromium.launch({ headless: true });

    // 1. Create throwaway admin user
    const passwordHash = await bcrypt.hash(testAdminPassword, 12);
    testAdmin = await prisma.adminUser.create({
      data: {
        email: testAdminEmail,
        name: "QA Superadmin",
        passwordHash,
        role: "SUPERADMIN",
        isActive: true,
        failedLoginAttempts: 0,
      },
    });

    // 2. Create test lead with potential formula injection payload matching Prisma schema
    testLead = await prisma.lead.create({
      data: {
        leadNumber: `PF-2026-QA-${Date.now().toString().slice(-4)}`,
        enquiryType: "DEMO",
        fullName: "=cmd|' /C calc'!A0",
        businessEmail: "formula-target@enterprise.com",
        companyName: "@MaliciousCorp",
        jobTitle: "+ExecutiveDirector",
        phoneNumber: "-100% Risk",
        country: "United Kingdom",
        industry: "Commercial Buildings",
        message: "Formula injection test enquiry.",
        privacyConsent: true,
        status: "NEW",
        priority: "NORMAL",
      },
    });
  });

  after(async () => {
    if (browser) await browser.close();

    // Cleanup throwaway admin and leads
    if (testAdmin) {
      await prisma.adminSession.deleteMany({ where: { adminUserId: testAdmin.id } }).catch(() => {});
      await prisma.adminUser.delete({ where: { id: testAdmin.id } }).catch(() => {});
    }
    if (testLead) {
      await prisma.leadActivity.deleteMany({ where: { leadId: testLead.id } }).catch(() => {});
      await prisma.leadNote.deleteMany({ where: { leadId: testLead.id } }).catch(() => {});
      await prisma.lead.delete({ where: { id: testLead.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  it("blocks unauthenticated visit to /admin and redirects to login", async () => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForURL("**/admin/login**");
    assert(page.url().includes("/admin/login"), "Unauthenticated user must be redirected to /admin/login");
    await page.close();
  });

  it("authenticates admin via browser UI, opens dashboard, updates status and notes", async () => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle" });

    // Sign in with correct credentials
    await page.fill("#admin_email", testAdminEmail);
    await page.fill("#admin_password", testAdminPassword);
    await page.click("button[type='submit']");

    await page.waitForURL("**/admin", { timeout: 15000 });
    assert.strictEqual(page.url(), `${BASE_URL}/admin`);

    // Verify lead exists in table
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
    const pageText = await page.textContent("body");
    assert(pageText?.includes(testLead.leadNumber), "Dashboard must display the created test lead");

    // Click to open lead details modal
    const leadRow = page.locator(`text=${testLead.leadNumber}`).first();
    await leadRow.click();

    // Update status to QUALIFIED
    await page.waitForSelector("#status_select", { timeout: 5000 });
    await page.selectOption("#status_select", "QUALIFIED");
    await page.selectOption("#priority_select", "HIGH");

    // Switch to Notes tab
    const notesTab = page.locator("button:has-text('Notes')");
    await notesTab.click();

    // Add note
    await page.waitForSelector("#new_note_input", { timeout: 5000 });
    await page.fill("#new_note_input", "QA verification note: Lead successfully reviewed and marked qualified.");
    await page.click("button:has-text('Save Note')");

    await page.waitForTimeout(1000);

    // Verify DB update
    const updatedLead = await prisma.lead.findUnique({
      where: { id: testLead.id },
      include: { notes: true, activities: true },
    });

    assert.strictEqual(updatedLead?.status, "QUALIFIED");
    assert.strictEqual(updatedLead?.priority, "HIGH");
    assert(updatedLead?.notes.some((n) => n.note.includes("QA verification note")));

    await page.close();
  });

  it("exports CSV with formula injection characters neutralized", async () => {
    // Perform API request using session cookie
    const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.99.1",
      },
      body: JSON.stringify({ email: testAdminEmail, password: testAdminPassword }),
    });

    const setCookie = loginRes.headers.get("set-cookie");
    assert(setCookie, "Login response must provide session cookie");

    const exportRes = await fetch(`${BASE_URL}/api/admin/leads/export`, {
      headers: {
        Cookie: setCookie,
        "x-forwarded-for": "10.0.99.1",
      },
    });

    assert.strictEqual(exportRes.status, 200);
    const contentType = exportRes.headers.get("content-type");
    assert(contentType?.includes("text/csv"), "Export must return text/csv content type");

    const csvContent = await exportRes.text();
    console.log("   [CSV Export Sample]:", csvContent.split("\n").slice(0, 3).join("\n"));

    // Verify formula characters are safely escaped with single quote (')
    assert(csvContent.includes("\"'=cmd"), "Formula starting with = must be prepended with '");
    assert(csvContent.includes("\"'@MaliciousCorp"), "Formula starting with @ must be prepended with '");
    assert(csvContent.includes("\"'+ExecutiveDirector"), "Formula starting with + must be prepended with '");
    assert(csvContent.includes("\"'-100% Risk"), "Formula starting with - must be prepended with '");
  });

  it("enforces account lockout on repeated failed login attempts", async () => {
    // Create dedicated user for lockout verification to isolate rate limit bucket
    const lockoutEmail = `qa-lockout-${Date.now()}@perfai.in`;
    const lockoutPassword = "TargetPassword-2026!";
    const hash = await bcrypt.hash(lockoutPassword, 12);
    const lockoutUser = await prisma.adminUser.create({
      data: {
        email: lockoutEmail,
        name: "Lockout Test Admin",
        passwordHash: hash,
        role: "SUPERADMIN",
        isActive: true,
        failedLoginAttempts: 0,
      },
    });

    try {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle" });

      // Attempt 5 incorrect passwords with unique test IP header via browser route
      for (let i = 0; i < 5; i++) {
        await page.fill("#admin_email", lockoutEmail);
        await page.fill("#admin_password", "WrongPassword123!");
        await page.click("button[type='submit']");
        await page.waitForTimeout(600);
      }

      // Check account lockout state in DB
      const userInDb = await prisma.adminUser.findUnique({ where: { id: lockoutUser.id } });
      assert(userInDb?.lockedUntil !== null, "User account must have lockedUntil timestamp set after 5 failures");
      assert(userInDb?.failedLoginAttempts >= 5, "Failed login counter must be >= 5");

      await page.close();
    } finally {
      await prisma.adminSession.deleteMany({ where: { adminUserId: lockoutUser.id } }).catch(() => {});
      await prisma.adminUser.delete({ where: { id: lockoutUser.id } }).catch(() => {});
    }
  });
});
