import { chromium } from "playwright";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const QA_DIR = path.resolve(process.cwd(), "qa", "screens");
if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function run() {
  const url = "http://localhost:3000";
  let server = null;
  let connected = false;

  try {
    const res = await fetch(url);
    if (res.ok) connected = true;
  } catch {}

  if (!connected) {
    console.log("Starting Next.js server for QA capture...");
    server = spawn("npm.cmd", ["run", "start", "--", "-p", "3000"], {
      stdio: "pipe",
      shell: true,
    });

    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(url);
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
    if (server) server.kill();
    process.exit(1);
  }

  console.log("Server ready. Launching Playwright Chromium with WebGL enabled...");
  const browser = await chromium.launch({
    args: ["--use-gl=swiftshader", "--enable-webgl", "--no-sandbox"],
  });

  const routes = [
    { path: "/", name: "home" },
    { path: "/application", name: "application" },
    { path: "/partner", name: "partner" },
  ];

  const viewports = [
    { name: "360", width: 360, height: 740 },
    { name: "1280", width: 1280, height: 800 },
  ];

  for (const route of routes) {
    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      });
      await page.goto(`${url}${route.path}`, { waitUntil: "networkidle" });

      // Verify horizontal overflow
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      console.log(
        `Route ${route.path} @ ${vp.name}px: Overflow = ${hasHorizontalOverflow ? "FAIL" : "PASSED (0 overflow)"}`
      );

      // On Homepage and Application, check for Canvas existence and pixel rendering
      if (route.name === "home" || route.name === "application") {
        const canvasCount = await page.locator("canvas").count();
        console.log(`Route ${route.path} @ ${vp.name}px: Detected <canvas> count = ${canvasCount}`);
        
        if (canvasCount > 0) {
          const canvasDetails = await page.evaluate(() => {
            const canvas = document.querySelector("canvas");
            if (!canvas) return null;
            const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
            const renderer = gl ? gl.getParameter(gl.RENDERER) : "Unknown";
            const rect = canvas.getBoundingClientRect();
            return {
              width: rect.width,
              height: rect.height,
              renderer: renderer,
              hasContext: !!gl,
            };
          });
          console.log(`Route ${route.path} @ ${vp.name}px: Canvas info:`, JSON.stringify(canvasDetails));
        }
      }

      // Capture Start (Top)
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(QA_DIR, `${route.name}_${vp.name}_start.png`),
      });

      // Capture Middle
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight * 0.45);
      });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(QA_DIR, `${route.name}_${vp.name}_middle.png`),
      });

      // Capture End
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(QA_DIR, `${route.name}_${vp.name}_end.png`),
      });

      await page.close();
    }
  }

  await browser.close();
  if (server) server.kill();
  console.log("QA screenshot capture completed successfully for all routes.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
