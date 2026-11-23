import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import "@/lib/env-check";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /api/admin routes (except /admin/login and /api/admin/auth/login)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Allow public login endpoints
    if (pathname === "/admin/login" || pathname === "/api/admin/auth/login") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("perfai_admin_session");
    if (!sessionCookie || !sessionCookie.value) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access" },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
