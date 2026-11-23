import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
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

async function main() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || "admin@perfai.in").trim().toLowerCase();
  const password = args[1] || process.env.ADMIN_PASSWORD || "AdminPlaceholder2026!";
  const name = args[2] || process.env.ADMIN_NAME || "PerfAI Administrator";
  const role = args[3] || "SUPERADMIN";

  if (!email || !password) {
    console.error("Usage: node scripts/create-admin.mjs <email> <password> [name] [role]");
    process.exit(1);
  }

  console.log(`Provisioning admin user: ${email}...`);

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role,
      isActive: true,
    },
    create: {
      email,
      name,
      passwordHash,
      role,
      isActive: true,
    },
  });

  console.log(`✅ Admin user [${admin.email}] successfully provisioned (Role: ${admin.role}, ID: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error("❌ Error provisioning admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
