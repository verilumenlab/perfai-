import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login and static assets)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // If user already has session cookie on login page, let page decide or proceed
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("perfai_admin_session");
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
