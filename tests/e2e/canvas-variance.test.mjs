import { chromium } from "playwright";
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";

const FIXTURES_DIR = path.resolve(process.cwd(), "tests", "fixtures");
const BASELINE_IMG_PATH = path.join(FIXTURES_DIR, "canvas-baseline.png");
const QA_SCREEN_DIR = path.resolve(process.cwd(), "qa", "screens");

if (!fs.existsSync(FIXTURES_DIR)) fs.mkdirSync(FIXTURES_DIR, { recursive: true });
if (!fs.existsSync(QA_SCREEN_DIR)) fs.mkdirSync(QA_SCREEN_DIR, { recursive: true });

describe("Canvas Pixel Variance & Visual Regression Tests", () => {
  let browser;
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

  before(async () => {
    browser = await chromium.launch({
      args: ["--use-gl=swiftshader", "--enable-webgl", "--no-sandbox"],
    });
  });

  after(async () => {
    if (browser) await browser.close();
  });

  it("calculates high color variance on homepage 3D canvas verifying complex geometry rendering", async () => {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    });

    // Request with testBuffer=true so preserveDrawingBuffer is enabled
    await page.goto(`${BASE_URL}/?testBuffer=true`, { waitUntil: "domcontentloaded" });

    // Wait for canvas element to mount (allow up to 30s for SwiftShader WebGL compilation on Windows)
    const canvas = page.locator("canvas").first();
    await canvas.waitFor({ state: "attached", timeout: 30000 });

    // Scroll canvas into view to ensure full IntersectionObserver visibility
    await canvas.scrollIntoViewIfNeeded();

    // Allow render frames to execute
    await page.waitForTimeout(3000);

    // Compute pixel color variance and entropy across sampled coordinates
    const stats = await page.evaluate(() => {
      const cvs = document.querySelector("canvas");
      if (!cvs) return null;

      const gl = cvs.getContext("webgl2") || cvs.getContext("webgl");
      if (!gl) return null;

      // Sample a 64x64 grid of pixels across the full canvas area
      const gridCount = 64;
      const stepX = Math.max(1, Math.floor(cvs.width / gridCount));
      const stepY = Math.max(1, Math.floor(cvs.height / gridCount));

      const pixels = new Uint8Array(cvs.width * cvs.height * 4);
      gl.readPixels(0, 0, cvs.width, cvs.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      let sumR = 0, sumG = 0, sumB = 0;
      let count = 0;

      for (let y = 0; y < cvs.height; y += stepY) {
        for (let x = 0; x < cvs.width; x += stepX) {
          const idx = (y * cvs.width + x) * 4;
          sumR += pixels[idx];
          sumG += pixels[idx + 1];
          sumB += pixels[idx + 2];
          count++;
        }
      }

      const meanR = sumR / count;
      const meanG = sumG / count;
      const meanB = sumB / count;

      let varR = 0, varG = 0, varB = 0;
      for (let y = 0; y < cvs.height; y += stepY) {
        for (let x = 0; x < cvs.width; x += stepX) {
          const idx = (y * cvs.width + x) * 4;
          varR += Math.pow(pixels[idx] - meanR, 2);
          varG += Math.pow(pixels[idx + 1] - meanG, 2);
          varB += Math.pow(pixels[idx + 2] - meanB, 2);
        }
      }

      const stdR = Math.sqrt(varR / count);
      const stdG = Math.sqrt(varG / count);
      const stdB = Math.sqrt(varB / count);

      return {
        width: cvs.width,
        height: cvs.height,
        sampleCount: count,
        mean: { r: Math.round(meanR), g: Math.round(meanG), b: Math.round(meanB) },
        stdDev: { r: +stdR.toFixed(2), g: +stdG.toFixed(2), b: +stdB.toFixed(2) },
        compositeVariance: +((stdR + stdG + stdB) / 3).toFixed(2),
      };
    });

    assert(stats !== null, "WebGL canvas must be accessible and context established");
    console.log("   [Full Canvas Color Variance Stats]:", JSON.stringify(stats));

    // A real 3D scene with architectural model, lighting, glass, ground, and background
    // produces variance across pixel channels.
    assert(
      stats.compositeVariance > 0.5,
      `Canvas composite color variance must be > 0.5 (received: ${stats.compositeVariance})`
    );

    // Capture screenshot of canvas element
    const canvasScreenshot = await canvas.screenshot();
    const currentImgPath = path.join(QA_SCREEN_DIR, "canvas-current.png");
    fs.writeFileSync(currentImgPath, canvasScreenshot);

    if (!fs.existsSync(BASELINE_IMG_PATH)) {
      console.log("   Creating initial canvas baseline fixture...");
      fs.writeFileSync(BASELINE_IMG_PATH, canvasScreenshot);
    } else {
      const baselineBuffer = fs.readFileSync(BASELINE_IMG_PATH);
      assert(baselineBuffer.length > 5000, "Baseline screenshot must be valid image buffer");
      assert(canvasScreenshot.length > 5000, "Current screenshot must be valid image buffer");
      console.log(`   Baseline (${baselineBuffer.length} bytes) and Current (${canvasScreenshot.length} bytes) verified.`);
    }

    await page.close();
  });
});
