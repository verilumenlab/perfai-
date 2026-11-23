import { chromium } from "playwright";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const QA_DIR = path.resolve(process.cwd(), "qa", "screens");
if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function run() {
  console.log("Starting Next.js production server for QA capture...");
  const server = spawn("npm.cmd", ["run", "start", "--", "-p", "3000"], {
    stdio: "pipe",
    shell: true,
  });

  server.stdout.on("data", (d) => {
    // console.log(`[server] ${d}`);
  });

  // Wait for server to become responsive
  const url = "http://localhost:3000";
  let connected = false;
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

  if (!connected) {
    console.error("Failed to connect to local server on port 3000");
    server.kill();
    process.exit(1);
  }

  console.log("Server is ready. Launching Playwright Chromium...");
  const browser = await chromium.launch();

  const viewports = [
    { name: "mobile_360", width: 360, height: 740 },
    { name: "tablet_768", width: 768, height: 1024 },
    { name: "desktop_1280", width: 1280, height: 800 },
    { name: "desktop_1920", width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(url, { waitUntil: "networkidle" });

    // Check horizontal scroll / overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    console.log(
      `Viewport ${vp.name} (${vp.width}x${vp.height}): Horizontal Overflow = ${hasHorizontalOverflow ? "FAIL" : "PASSED (0 overflow)"}`
    );

    if (vp.name === "mobile_360" || vp.name === "desktop_1280") {
      // 1. Start of scroll (Top)
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(QA_DIR, `${vp.name}_start.png`) });

      // 2. Middle of scroll (Technology / Building Scene in progress)
      await page.evaluate(() => {
        const el = document.getElementById("technology");
        if (el) el.scrollIntoView({ behavior: "instant" });
      });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(QA_DIR, `${vp.name}_middle.png`) });

      // 3. End of scroll (CTA demo block)
      await page.evaluate(() => {
        const el = document.getElementById("demo");
        if (el) el.scrollIntoView({ behavior: "instant" });
      });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(QA_DIR, `${vp.name}_end.png`) });
    } else {
      // Full overview screenshot for 768 and 1920
      await page.screenshot({ path: path.join(QA_DIR, `${vp.name}_overview.png`) });
    }

    await page.close();
  }

  await browser.close();
  server.kill();
  console.log("QA screenshot capture completed successfully. Output in /qa/screens/");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
