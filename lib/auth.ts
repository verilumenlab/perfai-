import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE_NAME = "perfai_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminUserId: string): Promise<string> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.adminSession.create({
    data: {
      sessionToken,
      adminUserId,
      expiresAt,
    },
  });

  return sessionToken;
}

export async function validateSessionToken(token: string) {
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { sessionToken: token },
    include: { adminUser: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date() || !session.adminUser.isActive) {
    // Delete expired or deactivated session
    await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.adminUser;
}

export async function revokeSession(token: string): Promise<void> {
  if (!token) return;
  await prisma.adminSession.delete({ where: { sessionToken: token } }).catch(() => {});
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  return validateSessionToken(token);
}
