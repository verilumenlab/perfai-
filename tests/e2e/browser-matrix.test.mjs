import { chromium } from "playwright";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";

describe("Cross-Viewport Responsive Matrix & Accessibility Fallback", () => {
  let browser;
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

  before(async () => {
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    if (browser) await browser.close();
  });

  const viewports = [
    { name: "360px Mobile (Small)", width: 360, height: 740 },
    { name: "390px Mobile (iPhone 14)", width: 390, height: 844 },
    { name: "768px Tablet (iPad Mini)", width: 768, height: 1024 },
    { name: "1024px Small Desktop", width: 1024, height: 768 },
    { name: "1280px Standard HD", width: 1280, height: 800 },
    { name: "1920px Full HD", width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    it(`verifies 0 horizontal overflow on ${vp.name} across core routes`, async () => {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

      const routes = ["/", "/application", "/partner"];
      for (const route of routes) {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        assert.strictEqual(
          overflow,
          false,
          `Route ${route} has horizontal overflow at ${vp.width}px viewport width!`
        );
      }

      await page.close();
    });
  }

  it("gracefully falls back to BuildingPoster when WebGL is unavailable", async () => {
    // Launch separate browser instance with WebGL strictly disabled
    const fallbackBrowser = await chromium.launch({
      headless: true,
      args: ["--disable-webgl", "--disable-3d-apis"],
    });

    const page = await fallbackBrowser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Verify canvas is not rendered
    const canvasCount = await page.locator("canvas").count();
    assert.strictEqual(canvasCount, 0, "No WebGL canvas should mount when WebGL is disabled");

    // Verify static poster fallback region is rendered and visible
    const poster = page.locator("[aria-label*='Commercial Building Infrastructure Visualization']").first();
    const isVisible = await poster.isVisible();
    assert.strictEqual(isVisible, true, "Poster fallback must be visible when WebGL is disabled");

    await fallbackBrowser.close();
  });

  it("supports keyboard-only skip-link and interactive tab traversal", async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    // Tab once: Skip link must become focused
    await page.keyboard.press("Tab");

    const focusedText = await page.evaluate(() => document.activeElement?.textContent);
    assert(focusedText?.includes("Skip to main content"), "First Tab stop must focus SkipLink");

    // Press Enter to activate SkipLink
    await page.keyboard.press("Enter");

    // Focused element should now be #main-content
    const mainFocused = await page.evaluate(() => document.activeElement?.id);
    assert.strictEqual(mainFocused, "main-content", "Skip link must transfer focus to #main-content");

    await page.close();
  });
});
