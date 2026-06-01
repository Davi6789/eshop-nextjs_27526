//  src/middleware.ts

import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";
  const path = req.nextUrl.pathname;

  // Admin Routes schützen
  if (path.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Dashboard Routes schützen (nur eingeloggte User)
  if (path.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Checkout nur für eingeloggte User
  if (path.startsWith("/checkout") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

    // Wenn eingeloggt und auf login/register Seite -> redirect zu dashboard
  if (isLoggedIn && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
