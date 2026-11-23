import { spawn } from "child_process";
import http from "http";

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

function runCommand(cmd, args) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { stdio: "inherit", shell: true });
    proc.on("close", (code) => resolve(code ?? 1));
  });
}

async function main() {
  console.log("=======================================================");
  console.log("🚀 PERFAI FULL-SYSTEM RELEASE CANDIDATE QA SUITE");
  console.log("=======================================================\n");

  let serverProcess = null;
  const isUp = await checkServer();

  if (!isUp) {
    console.log("Starting Next.js production server for QA suite on port 3000...");
    serverProcess = spawn("npm.cmd", ["run", "start", "--", "-p", "3000"], {
      stdio: "pipe",
      shell: true,
      env: { ...process.env, TEST_MODE: "true" },
    });

    const ready = await waitForServer(25000);
    if (!ready) {
      console.error("❌ Failed to start Next.js production server within timeout.");
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
    console.log("✅ Next.js production server is active on http://localhost:3000\n");
  } else {
    console.log("✅ Existing Next.js server detected on http://localhost:3000\n");
  }

  const testSuites = [
    { name: "Unit Tests", cmd: "node", args: ["--experimental-strip-types", "--test", "tests/unit/*.test.mjs"] },
    { name: "Link Crawler", cmd: "node", args: ["--experimental-strip-types", "--test", "tests/e2e/link-crawler.test.mjs"] },
    { name: "Canvas Variance & Visual Regression", cmd: "node", args: ["--experimental-strip-types", "--test", "tests/e2e/canvas-variance.test.mjs"] },
    { name: "Enquiry Form & Attribution Matrix", cmd: "node", args: ["--experimental-strip-types", "--test", "tests/e2e/form-matrix.test.mjs"] },
    { name: "Admin Security & Audit Trail Matrix", cmd: "node", args: ["--experimental-strip-types", "--test", "tests/e2e/admin-matrix.test.mjs"] },
    { name: "Responsive Viewports & Accessibility Fallbacks", cmd: "node", args: ["--experimental-strip-types", "--test", "tests/e2e/browser-matrix.test.mjs"] },
    { name: "Navbar Scroll Animation & Responsive Screenshots", cmd: "node", args: ["--experimental-strip-types", "--test", "tests/e2e/navbar-scroll.test.mjs"] },
  ];

  let failedSuites = 0;

  for (const suite of testSuites) {
    console.log(`\n-------------------------------------------------------`);
    console.log(`▶ Executing QA Suite: ${suite.name}`);
    console.log(`-------------------------------------------------------`);
    const code = await runCommand(suite.cmd, suite.args);
    if (code !== 0) {
      console.error(`❌ Suite [${suite.name}] FAILED with exit code ${code}`);
      failedSuites++;
    } else {
      console.log(`✅ Suite [${suite.name}] PASSED`);
    }
  }

  if (serverProcess) {
    console.log("\nShutting down QA background server process...");
    serverProcess.kill();
  }

  console.log("\n=======================================================");
  if (failedSuites === 0) {
    console.log("🎉 ALL QA SUITES PASSED! RELEASE CANDIDATE VERIFIED.");
  } else {
    console.error(`❌ ${failedSuites} QA SUITE(S) FAILED.`);
    process.exit(1);
  }
  console.log("=======================================================\n");
}

main().catch((err) => {
  console.error("QA execution fatal error:", err);
  process.exit(1);
});
