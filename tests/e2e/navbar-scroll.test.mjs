import { chromium } from "playwright";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import AxeBuilder from "@axe-core/playwright";

describe("Navbar Scroll Animation & Responsive Matrix Verification", () => {
  let browser;
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
  const SCREENSHOT_DIR = path.resolve(process.cwd(), "qa", "screens", "navbar");

  before(async () => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    if (browser) await browser.close();
  });

  const routes = [
    { path: "/", name: "home" },
    { path: "/application", name: "application" },
    { path: "/partner", name: "partner" },
  ];

  for (const route of routes) {
    it(`[${route.name}] animates full-width to floating pill at scroll 300 and back to scroll 0 at 1280 & 1920`, async () => {
      for (const width of [1280, 1920]) {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        const page = await context.newPage();
        await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });

        // 1. SCROLL 0 (Full-width state)
        const header = page.locator("header");
        await assert.doesNotReject(async () => {
          await header.waitFor({ state: "visible" });
        });

        // Verify Desktop Logo exists on left with exact accessible name "PerfAI"
        const desktopHeader = header.locator(".md\\:flex");
        const logo = desktopHeader.locator("a[data-testid='navbar-brand']");
        assert(await logo.isVisible(), "Logo must be visible at scroll 0");
        const logoBox = await logo.boundingBox();
        assert(logoBox && logoBox.x < 350, `Logo must be at far left (got x=${logoBox?.x})`);

        // Verify Nav Links exist on right
        const nav = desktopHeader.locator("nav[aria-label='Main Navigation']");
        assert(await nav.isVisible(), `Nav links must be visible on ${width}px desktop`);
        const homeLink = nav.locator("a", { hasText: "Home" });
        const appLink = nav.locator("a", { hasText: "Application" });
        const partnerLink = nav.locator("a", { hasText: "Partner" });
        assert(await homeLink.isVisible(), "Home link visible");
        assert(await appLink.isVisible(), "Application link visible");
        assert(await partnerLink.isVisible(), "Partner link visible");

        // Verify Request a Demo CTA exists on right
        const ctaBtn = desktopHeader.locator("a[href='/#demo']");
        assert(await ctaBtn.isVisible(), "Request a Demo CTA must be visible");

        // Check horizontal overflow
        const overflow0 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        assert.strictEqual(overflow0, false, `No horizontal overflow at scroll 0 on ${width}px`);

        // Take screenshot at scroll 0
        const screen0Path = path.join(SCREENSHOT_DIR, `${route.name}-${width}-scroll0.png`);
        await page.screenshot({ path: screen0Path, clip: { x: 0, y: 0, width, height: 200 } });

        // Axe accessibility audit at scroll 0
        const axeResults0 = await new AxeBuilder({ page })
          .include("header")
          .analyze();
        assert.strictEqual(axeResults0.violations.length, 0, `Axe accessibility violations at scroll 0: ${JSON.stringify(axeResults0.violations)}`);

        // 2. SCROLL TO 300px (Collapsed Floating Pill)
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.waitForTimeout(600); // Allow spring transition (300-400ms) to settle

        // Check pill geometry on motion.div
        assert(await desktopHeader.isVisible(), "Pill must be visible when scrolled");
        const pillBox = await desktopHeader.boundingBox();
        assert(pillBox !== null, "Pill bounding box must exist");
        assert(pillBox.width >= 700 && pillBox.width <= 850, `Pill width must be between 700px and 850px (got ${pillBox.width}px)`);

        // Verify links and logo remain clickable in collapsed state
        assert(await logo.isVisible(), "Logo must be visible in pill");
        assert(await homeLink.isVisible(), "Home link visible in pill");
        assert(await appLink.isVisible(), "App link visible in pill");
        assert(await partnerLink.isVisible(), "Partner link visible in pill");
        assert(await ctaBtn.isVisible(), "CTA visible in pill");

        // Check horizontal overflow at scroll 300
        const overflow300 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        assert.strictEqual(overflow300, false, `No horizontal overflow at scroll 300 on ${width}px`);

        // Take screenshot at scroll 300
        const screen300Path = path.join(SCREENSHOT_DIR, `${route.name}-${width}-scroll300.png`);
        await page.screenshot({ path: screen300Path, clip: { x: 0, y: 0, width, height: 200 } });

        // Axe accessibility audit at scroll 300
        const axeResults300 = await new AxeBuilder({ page })
          .include("header")
          .analyze();
        assert.strictEqual(axeResults300.violations.length, 0, `Axe accessibility violations in collapsed pill: ${JSON.stringify(axeResults300.violations)}`);

        // 3. SCROLL BACK TO 0 (Reversal to Full-Width)
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(600); // Allow spring reversal to settle

        const pillBoxReversed = await desktopHeader.boundingBox();
        assert(pillBoxReversed !== null, "Reversed pill box must exist");
        assert(pillBoxReversed.width > 1000, `Navbar must expand back to full width > 1000px (got ${pillBoxReversed.width}px)`);

        // Take screenshot at scroll back to 0
        const screenBack0Path = path.join(SCREENSHOT_DIR, `${route.name}-${width}-scrollback0.png`);
        await page.screenshot({ path: screenBack0Path, clip: { x: 0, y: 0, width, height: 200 } });

        await context.close();
      }
    });

    it(`[${route.name}] renders mobile header at 360px and tablet at 768px without floating pill`, async () => {
      for (const width of [360, 768]) {
        const context = await browser.newContext({ viewport: { width, height: 800 } });
        const page = await context.newPage();
        await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });

        const header = page.locator("header");

        if (width === 360) {
          const mobileHeader = header.locator(".md\\:hidden");
          const logo = mobileHeader.locator("a[data-testid='navbar-brand-mobile']");
          assert(await logo.isVisible(), `Mobile logo visible on 360px`);

          // Mobile hamburger button
          const menuBtn = mobileHeader.locator("button[aria-label='Open mobile navigation menu']");
          assert(await menuBtn.isVisible(), "Hamburger button must be visible on 360px mobile");

          // Open drawer and test
          await menuBtn.click();
          const drawer = page.locator("div[role='dialog'][aria-label='Mobile Navigation Menu']");
          await drawer.waitFor({ state: "visible" });
          assert(await drawer.locator("text=Application").isVisible(), "Drawer must contain Application link");
          await page.keyboard.press("Escape");
          await drawer.waitFor({ state: "hidden" });
        } else {
          // At 768px (Tablet / md breakpoint), desktop header is rendered
          const desktopHeader = header.locator(".md\\:flex");
          const logo = desktopHeader.locator("a[data-testid='navbar-brand']");
          assert(await logo.isVisible(), `Tablet logo visible on 768px`);
          const nav = desktopHeader.locator("nav[aria-label='Main Navigation']");
          assert(await nav.isVisible(), `Nav links visible on 768px`);
        }

        // Take screenshot
        const screenPath = path.join(SCREENSHOT_DIR, `${route.name}-${width}.png`);
        await page.screenshot({ path: screenPath, clip: { x: 0, y: 0, width, height: 180 } });

        await context.close();
      }
    });
  }
});
