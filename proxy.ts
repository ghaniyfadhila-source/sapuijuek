import { NextRequest, NextResponse } from "next/server";
import { isProtectedAdminPath, isValidSessionToken } from "@/lib/auth/session";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const authed = isValidSessionToken(req.cookies.get(ACCESS_COOKIE)?.value);

  // Sudah login → jangan ditahan di halaman login
  if (pathname === "/admin/login") {
    if (authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Area admin tanpa session valid → lempar ke login
  if (isProtectedAdminPath(pathname) && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
