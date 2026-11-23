import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const REPORT_DIR = path.resolve(process.cwd(), "qa", "lighthouse");
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

const BASE_URL = "http://localhost:3000";

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(Boolean(res.statusCode && res.statusCode < 500));
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await checkServer()) return true;
    await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}

async function runLighthouse(urlPath, name) {
  const fullUrl = `${BASE_URL}${urlPath}`;
  const jsonPath = path.join(REPORT_DIR, `${name}-mobile.report.json`);

  console.log(`\nRunning Lighthouse Mobile Audit on ${fullUrl}...`);

  const cmd = `npx.cmd lighthouse ${fullUrl} --output=json --output-path="${jsonPath}" --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet`;

  execSync(cmd, { stdio: "inherit" });

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Report not generated at ${jsonPath}`);
  }

  const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const categories = report.categories;
  const audits = report.audits;

  const result = {
    route: urlPath,
    performance: Math.round((categories.performance?.score || 0) * 100),
    accessibility: Math.round((categories.accessibility?.score || 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
    seo: Math.round((categories.seo?.score || 0) * 100),
    fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
    lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
    tbt: audits["total-blocking-time"]?.displayValue || "N/A",
    cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
  };

  return result;
}

async function main() {
  console.log("=======================================================");
  console.log("⚡ LIGHTHOUSE MOBILE PERFORMANCE & CORE WEB VITALS AUDIT");
  console.log("=======================================================\n");

  let serverProcess = null;
  const isUp = await checkServer();

  if (!isUp) {
    console.log("Starting Next.js production server for Lighthouse audit...");
    serverProcess = spawn("npm.cmd", ["run", "start", "--", "-p", "3000"], {
      stdio: "pipe",
      shell: true,
    });
    const ready = await waitForServer(25000);
    if (!ready) {
      console.error("Failed to start server.");
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
  }

  const targets = [
    { path: "/", name: "home" },
    { path: "/application", name: "application" },
    { path: "/partner", name: "partner" },
  ];

  const results = [];

  for (const t of targets) {
    try {
      const res = await runLighthouse(t.path, t.name);
      results.push(res);
      console.log(`   [${t.path}] Scores -> Perf: ${res.performance} | A11y: ${res.accessibility} | BP: ${res.bestPractices} | SEO: ${res.seo}`);
      console.log(`   [${t.path}] CWV    -> LCP: ${res.lcp} | CLS: ${res.cls} | TBT: ${res.tbt} | FCP: ${res.fcp}`);
    } catch (e) {
      console.error(`Audit failed on ${t.path}:`, e.message);
    }
  }

  if (serverProcess) {
    serverProcess.kill();
  }

  console.log("\n=======================================================");
  console.log("📊 FINAL LIGHTHOUSE AUDIT REPORT SUMMARY");
  console.log("=======================================================");
  console.table(results);

  // Write markdown report
  const mdReport = [
    "# PerfAI Release Candidate — Lighthouse Mobile Audit Report",
    "",
    "| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |",
    "| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |",
    ...results.map(
      (r) =>
        `| \`${r.route}\` | **${r.performance}** | **${r.accessibility}** | **${r.bestPractices}** | **${r.seo}** | ${r.lcp} | ${r.cls} | ${r.tbt} |`
    ),
    "",
  ].join("\n");

  fs.writeFileSync(path.join(REPORT_DIR, "LIGHTHOUSE_REPORT.md"), mdReport);
  console.log(`Report written to qa/lighthouse/LIGHTHOUSE_REPORT.md\n`);
}

main().catch((err) => {
  console.error("Lighthouse runner failure:", err);
  process.exit(1);
});
