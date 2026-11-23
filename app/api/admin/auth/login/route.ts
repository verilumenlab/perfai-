import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createAdminSession, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";

    // Rate limit login attempts: 5 per minute per IP
    const rateLimit = checkRateLimit(`login_${clientIp}`, 5, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please wait 1 minute." },
        { status: 429 }
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
    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!adminUser || !adminUser.isActive) {
      // Intentionally generic message to prevent user enumeration
      return NextResponse.json(
        { success: false, error: "Invalid credentials or account suspended" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(body.password, adminUser.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session token
    const sessionToken = await createAdminSession(adminUser.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
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
