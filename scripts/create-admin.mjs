import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";
import fs from "fs";
import path from "path";

// Load .env if present
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = process.env[key] || value;
    }
  }
}

const prisma = new PrismaClient();

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const stdin = process.stdin;
    const isRaw = stdin.isRaw;

    process.stdout.write(question);

    let password = "";

    // If running in an environment without TTY (e.g. piped input), read standard line
    if (!process.stdin.isTTY) {
      rl.question("", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    stdin.setRawMode(true);
    stdin.resume();

    const onData = (chunk) => {
      const char = chunk.toString("utf8");
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode(isRaw || false);
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        rl.close();
        resolve(password.trim());
      } else if (char === "\u0003") {
        // Ctrl+C
        process.exit(1);
      } else if (char === "\b" || char === "\x7f") {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else {
        password += char;
        process.stdout.write("*");
      }
    };

    stdin.on("data", onData);
  });
}

function promptVisible(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("=== PerfAI Enterprise Admin Provisioning ===");

  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;
  let name = process.env.ADMIN_NAME;

  if (!email) {
    email = await promptVisible("Enter administrator email: ");
  }

  if (!email || !email.includes("@")) {
    console.error("❌ Invalid email address.");
    process.exit(1);
  }

  email = email.trim().toLowerCase();

  if (!password) {
    password = await promptHidden("Enter secure password (min 12 characters, input hidden): ");
  }

  if (!password || password.length < 12) {
    console.error("❌ Password must be at least 12 characters long.");
    process.exit(1);
  }

  if (!name) {
    name = (await promptVisible("Enter administrator full name (optional, press Enter for 'System Admin'): ")) || "System Admin";
  }

  console.log(`Provisioning administrator account for: ${email}...`);

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "SUPERADMIN",
      isActive: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    create: {
      email,
      name,
      passwordHash,
      role: "SUPERADMIN",
      isActive: true,
      failedLoginAttempts: 0,
    },
  });

  console.log(`✅ Administrator successfully provisioned (ID: ${admin.id}, Role: ${admin.role})`);
}

main()
  .catch((e) => {
    console.error("❌ Provisioning failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
