import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { homeForRole } from "@/lib/roles";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const user = session?.user;

  const isAuthRoute =
    pathname === "/sign-in" ||
    pathname.startsWith("/sign-in/") ||
    pathname === "/sign-up" ||
    pathname.startsWith("/sign-up/");

  if (user && isAuthRoute) {
    return NextResponse.redirect(
      new URL(homeForRole(user.role), request.url),
    );
  }

  const isMenuDetail = pathname.startsWith("/menu/");
  const isDashboard =
    pathname.startsWith("/user/") ||
    pathname.startsWith("/vendor/") ||
    pathname.startsWith("/admin/");
  const isProfile = pathname === "/profile" || pathname.startsWith("/profile/");
  const isProtectedRoute = isMenuDetail || isDashboard || isProfile;

  if (!user && isProtectedRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/menu/:path*",
    "/user/:path*",
    "/vendor/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
