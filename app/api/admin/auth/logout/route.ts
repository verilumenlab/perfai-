import { NextRequest, NextResponse } from "next/server";
import { revokeSession, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token) {
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

    return response;
  } catch (error) {
    console.error("[Admin Logout Error]:", error);
    return NextResponse.json({ success: true });
  }
}
