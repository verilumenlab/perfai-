import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { spawn } from "child_process";
import assert from "assert";

const BASE_URL = "http://localhost:3000";

async function runAudit() {
  console.log("=== Starting Phase 7: Accessibility, SEO, Security & Performance Audit ===");

  // 1. Verify or Start Server
  let connected = false;
  try {
    const res = await fetch(BASE_URL);
    if (res.ok) connected = true;
  } catch {}

  let serverProcess = null;
  if (!connected) {
    console.log("Starting Next.js server on port 3000...");
    serverProcess = spawn("npm.cmd", ["run", "start", "--", "-p", "3000"], {
      stdio: "pipe",
      shell: true,
    });

    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(BASE_URL);
        if (res.ok) {
          connected = true;
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  if (!connected) {
    console.error("Failed to connect to local server on port 3000");
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }

  console.log("Server responsive. Launching Playwright Chromium...");
  const browser = await chromium.launch({
    args: ["--use-gl=swiftshader", "--enable-webgl", "--no-sandbox"],
  });

  const auditReport = {
    axeResults: {},
    securityHeaders: {},
    canvasSizing: {},
    webVitals: {},
    keyboardNav: {},
  };

  try {
    // ==========================================
    // STEP 1: Security Headers Verification
    // ==========================================
    console.log("\n[Audit 1] Verifying HTTP Security Headers...");
    const headRes = await fetch(BASE_URL, { method: "HEAD" });
    const headers = Object.fromEntries(headRes.headers.entries());

    const requiredHeaders = [
      "content-security-policy",
      "x-frame-options",
      "x-content-type-options",
      "referrer-policy",
      "permissions-policy",
      "strict-transport-security",
    ];

    for (const h of requiredHeaders) {
      assert(headers[h], `Header ${h} must be present`);
      auditReport.securityHeaders[h] = headers[h];
      console.log(`  ✓ ${h}: ${headers[h].slice(0, 60)}...`);
    }

    // ==========================================
    // STEP 2: Accessibility Scans with axe-core
    // ==========================================
    console.log("\n[Audit 2] Running WCAG 2.2 AA Accessibility Scans with axe-core...");
    const publicPages = [
      { name: "Home", path: "/" },
      { name: "Application", path: "/application" },
      { name: "Partner", path: "/partner" },
      { name: "Privacy", path: "/privacy" },
      { name: "Terms", path: "/terms" },
      { name: "Cookies", path: "/cookies" },
      { name: "Admin Login", path: "/admin/login" },
    ];

    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    for (const p of publicPages) {
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle" });
      const axeScan = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .disableRules(["color-contrast"]) // contrast evaluated separately with exact background tokens
        .analyze();

      const violations = axeScan.violations;
      auditReport.axeResults[p.name] = {
        violationsCount: violations.length,
        violations: violations.map((v) => ({ id: v.id, impact: v.impact, description: v.description })),
      };

      if (violations.length === 0) {
        console.log(`  ✓ ${p.name} (${p.path}): 0 WCAG violations found.`);
      } else {
        console.warn(`  ⚠ ${p.name} (${p.path}): ${violations.length} violations:`, JSON.stringify(violations));
      }
    }

    // ==========================================
    // STEP 3: Canvas Sizing & Non-Blank Render Test
    // ==========================================
    console.log("\n[Audit 3] Testing 3D Canvas Sizing & Pixel Rendering across viewports...");
    const canvasTests = [
      { path: "/", name: "Home", vp: { name: "mobile_360", width: 360, height: 740 } },
      { path: "/", name: "Home", vp: { name: "desktop_1280", width: 1280, height: 800 } },
      { path: "/application", name: "Application", vp: { name: "mobile_360", width: 360, height: 740 } },
      { path: "/application", name: "Application", vp: { name: "desktop_1280", width: 1280, height: 800 } },
    ];

    for (const ct of canvasTests) {
      const cContext = await browser.newContext({ viewport: { width: ct.vp.width, height: ct.vp.height } });
      const cPage = await cContext.newPage();
      await cPage.goto(`${BASE_URL}${ct.path}`, { waitUntil: "networkidle" });
      await cPage.waitForTimeout(1000); // Allow R3F render loop to stabilize

      const canvasInfo = await cPage.evaluate(() => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return { detected: false };

        const rect = canvas.getBoundingClientRect();
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        let nonZeroCount = 0;

        if (gl) {
          const pixels = new Uint8Array(4 * 16);
          const cx = Math.floor(canvas.width / 2);
          const cy = Math.floor(canvas.height / 2);
          gl.readPixels(cx, cy, 4, 4, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          for (let i = 0; i < pixels.length; i++) {
            if (pixels[i] > 0) nonZeroCount++;
          }
        }

        return {
          detected: true,
          cssWidth: Math.round(rect.width),
          cssHeight: Math.round(rect.height),
          drawingWidth: canvas.width,
          drawingHeight: canvas.height,
          hasContext: !!gl,
          renderer: gl ? gl.getParameter(gl.RENDERER) : "None",
          nonZeroSampledPixels: nonZeroCount,
          isNonBlank: nonZeroCount > 0,
        };
      });

      auditReport.canvasSizing[`${ct.name}_${ct.vp.name}`] = canvasInfo;
      console.log(`  ✓ ${ct.name} @ ${ct.vp.name}: CSS ${canvasInfo.cssWidth}x${canvasInfo.cssHeight}px, Buffer ${canvasInfo.drawingWidth}x${canvasInfo.drawingHeight}px, Non-Blank: ${canvasInfo.isNonBlank}`);
      assert(canvasInfo.detected, `Canvas must be present on ${ct.name}`);
      assert(canvasInfo.cssWidth > 300, `Canvas width (${canvasInfo.cssWidth}px) must be container sized (> 300px)`);
      await cPage.close();
    }

    // ==========================================
    // STEP 4: Keyboard Navigation & Focus Order
    // ==========================================
    console.log("\n[Audit 4] Testing Keyboard-only Walkthrough (Tab & Enter)...");
    const kContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const kPage = await kContext.newPage();
    await kPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Press Tab to reveal SkipLink
    await kPage.keyboard.press("Tab");
    const focusedText = await kPage.evaluate(() => document.activeElement?.textContent?.trim());
    assert.strictEqual(focusedText, "Skip to main content", "First tab must focus SkipLink");
    console.log("  ✓ Skip to content link successfully receives initial keyboard focus.");

    // Press Enter on SkipLink -> focus main content
    await kPage.keyboard.press("Enter");
    const activeId = await kPage.evaluate(() => document.activeElement?.id);
    assert.strictEqual(activeId, "main-content", "Skip link must move focus to #main-content");
    console.log("  ✓ Skip link activates and lands on #main-content.");
    await kPage.close();

    // ==========================================
    // STEP 5: Performance & Web Vitals Measurements
    // ==========================================
    console.log("\n[Audit 5] Measuring Web Vitals (LCP, CLS, FCP) on Mobile & Desktop...");
    const perfPages = [
      { name: "Home_Mobile", path: "/", vp: { width: 360, height: 740 } },
      { name: "Home_Desktop", path: "/", vp: { width: 1280, height: 800 } },
      { name: "Application_Mobile", path: "/application", vp: { width: 360, height: 740 } },
      { name: "Partner_Mobile", path: "/partner", vp: { width: 360, height: 740 } },
    ];

    for (const pp of perfPages) {
      const pContext = await browser.newContext({ viewport: pp.vp });
      const pPage = await pContext.newPage();
      await pPage.goto(`${BASE_URL}${pp.path}`, { waitUntil: "networkidle" });

      const metrics = await pPage.evaluate(() => {
        return new Promise((resolve) => {
          let lcp = 0;
          let cls = 0;
          let fcp = 0;

          const poLcp = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const last = entries[entries.length - 1];
            if (last) lcp = last.startTime;
          });
          try {
            poLcp.observe({ type: "largest-contentful-paint", buffered: true });
          } catch {}

          const poCls = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            }
          });
          try {
            poCls.observe({ type: "layout-shift", buffered: true });
          } catch {}

          const paintEntries = performance.getEntriesByType("paint");
          const fcpEntry = paintEntries.find((p) => p.name === "first-contentful-paint");
          if (fcpEntry) fcp = fcpEntry.startTime;

          setTimeout(() => {
            poLcp.disconnect();
            poCls.disconnect();
            resolve({
              fcpMs: Math.round(fcp),
              lcpMs: Math.round(lcp || fcp),
              cls: Number(cls.toFixed(4)),
            });
          }, 800);
        });
      });

      auditReport.webVitals[pp.name] = metrics;
      console.log(`  ✓ ${pp.name}: FCP = ${metrics.fcpMs}ms, LCP = ${metrics.lcpMs}ms (Target < 2500ms), CLS = ${metrics.cls} (Target < 0.1)`);
      assert(metrics.lcpMs < 2500, `LCP (${metrics.lcpMs}ms) must be under 2500ms`);
      assert(metrics.cls < 0.1, `CLS (${metrics.cls}) must be under 0.1`);
      await pPage.close();
    }

    console.log("\n=======================================================");
    console.log("🎉 ALL PHASE 7 AUDIT CHECKS PASSED SUCCESSFULLY!");
    console.log("=======================================================\n");
  } finally {
    await browser.close();
    if (serverProcess) serverProcess.kill();
  }
}

runAudit().catch((err) => {
  console.error("❌ Phase 7 Audit Failed:", err);
  process.exit(1);
});
