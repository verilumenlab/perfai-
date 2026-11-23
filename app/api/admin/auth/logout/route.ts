import { NextRequest, NextResponse } from "next/server";
import { revokeSession, validateCsrf, ADMIN_COOKIE_NAME, CSRF_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token) {
      // Validate CSRF on logout mutation
      const csrfCheck = validateCsrf(req, token);
      if (!csrfCheck.valid) {
        return NextResponse.json({ success: false, error: csrfCheck.reason }, { status: 403 });
      }

      await revokeSession(token);
    }

    const response = NextResponse.json({ success: true, message: "Logged out" });
    response.cookies.set(ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set(CSRF_COOKIE_NAME, "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[Admin Logout Error]:", error);
    return NextResponse.json({ success: true });
  }
}
