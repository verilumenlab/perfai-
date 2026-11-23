import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createAdminSession, ADMIN_COOKIE_NAME, CSRF_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // 1. IP Rate Limiting (5 attempts / 5 mins)
    const ipRateLimit = await checkRateLimit(`login_ip_${clientIp}`, 5, 5 * 60 * 1000);
    if (!ipRateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts from this IP. Please wait 5 minutes.",
        },
        {
          status: 429,
          headers: { "Retry-After": Math.ceil(ipRateLimit.resetMs / 1000).toString() },
        }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const email = String(body.email).trim().toLowerCase();

    // 2. Email Rate Limiting (prevent targeted brute force against a specific account)
    const emailRateLimit = await checkRateLimit(`login_email_${email}`, 5, 5 * 60 * 1000);
    if (!emailRateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed attempts for this account. Please wait 5 minutes.",
        },
        {
          status: 429,
          headers: { "Retry-After": Math.ceil(emailRateLimit.resetMs / 1000).toString() },
        }
      );
    }

    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!adminUser || !adminUser.isActive) {
      // Generic error message to prevent account enumeration
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Account Lockout Check
    if (adminUser.lockedUntil && adminUser.lockedUntil.getTime() > Date.now()) {
      const remainingMin = Math.ceil((adminUser.lockedUntil.getTime() - Date.now()) / (60 * 1000));
      return NextResponse.json(
        {
          success: false,
          error: `Account is temporarily locked. Try again in ${remainingMin} minute${remainingMin > 1 ? "s" : ""}.`,
        },
        { status: 423 }
      );
    }

    const isValid = await verifyPassword(body.password, adminUser.passwordHash);

    if (!isValid) {
      const newFailedCount = adminUser.failedLoginAttempts + 1;
      const isNowLocked = newFailedCount >= MAX_LOGIN_ATTEMPTS;

      await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: {
          failedLoginAttempts: newFailedCount,
          lockedUntil: isNowLocked ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
        },
      });

      if (isNowLocked) {
        return NextResponse.json(
          {
            success: false,
            error: "Account has been temporarily locked for 15 minutes due to multiple failed login attempts.",
          },
          { status: 423 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4. Successful login: reset failed attempts & update lastLoginAt
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // 5. Create fresh hashed session & CSRF token
    const { sessionToken, csrfToken } = await createAdminSession(adminUser.id);

    const response = NextResponse.json({
      success: true,
      csrfToken,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });

    // Secure HTTP-only session cookie
    response.cookies.set(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours absolute maxAge
    });

    // CSRF cookie (accessible to client JS so it can submit x-csrf-token header)
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal authentication error" },
      { status: 500 }
    );
  }
}
