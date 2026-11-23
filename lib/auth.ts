import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE_NAME = "perfai_admin_session";
export const CSRF_COOKIE_NAME = "perfai_csrf_token";

const ABSOLUTE_SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
const IDLE_SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours idle timeout

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateCsrfToken(rawToken: string): string {
  const secret = process.env.CSRF_SECRET || "perfai-super-secret-csrf-key-2026";
  return crypto.createHmac("sha256", secret).update(rawToken).digest("hex");
}

export async function createAdminSession(adminUserId: string): Promise<{ sessionToken: string; csrfToken: string }> {
  // Rotate: invalidate any existing sessions for this user on new login
  await prisma.adminSession.deleteMany({
    where: { adminUserId },
  }).catch(() => {});

  const sessionToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date(Date.now() + ABSOLUTE_SESSION_TIMEOUT_MS);
  const lastActiveAt = new Date();

  await prisma.adminSession.create({
    data: {
      tokenHash,
      adminUserId,
      expiresAt,
      lastActiveAt,
    },
  });

  const csrfToken = generateCsrfToken(sessionToken);

  return { sessionToken, csrfToken };
}

export async function validateSessionToken(rawToken: string) {
  if (!rawToken || typeof rawToken !== "string") return null;

  const tokenHash = hashToken(rawToken);

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { adminUser: true },
  });

  if (!session) return null;

  const now = Date.now();

  // 1. Absolute expiry check
  if (session.expiresAt.getTime() < now) {
    await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  // 2. Idle timeout check
  if (now - session.lastActiveAt.getTime() > IDLE_SESSION_TIMEOUT_MS) {
    await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  // 3. User account active check
  if (!session.adminUser.isActive) {
    await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  // Touch lastActiveAt (idle extension) asynchronously if more than 60s passed
  if (now - session.lastActiveAt.getTime() > 60 * 1000) {
    prisma.adminSession.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});
  }

  return session.adminUser;
}

export async function revokeSession(rawToken: string): Promise<void> {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  await prisma.adminSession.delete({ where: { tokenHash } }).catch(() => {});
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  return validateSessionToken(token);
}

/**
 * Validates Origin/Host and CSRF token on mutating requests (POST/PATCH/PUT/DELETE).
 */
export function validateCsrf(req: NextRequest, rawToken: string): { valid: boolean; reason?: string } {
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // Origin or Referer must match host
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return { valid: false, reason: "Origin header does not match Host" };
      }
    } catch {
      return { valid: false, reason: "Malformed Origin header" };
    }
  } else if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) {
        return { valid: false, reason: "Referer header does not match Host" };
      }
    } catch {
      return { valid: false, reason: "Malformed Referer header" };
    }
  }

  const expectedCsrfToken = generateCsrfToken(rawToken);
  const clientCsrfToken = req.headers.get("x-csrf-token");

  if (!clientCsrfToken) {
    return { valid: false, reason: "Missing x-csrf-token header" };
  }

  // Timing-safe comparison
  const clientBuf = Buffer.from(clientCsrfToken);
  const expectedBuf = Buffer.from(expectedCsrfToken);

  if (clientBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(clientBuf, expectedBuf)) {
    return { valid: false, reason: "Invalid CSRF token" };
  }

  return { valid: true };
}
