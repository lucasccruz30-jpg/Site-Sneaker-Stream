import { NextResponse } from "next/server";

import { auth } from "@/auth";

const authProtectedRoutes = ["/minha-conta", "/meus-pedidos", "/checkout"];

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute = authProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isLoggedIn && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && req.auth?.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/minha-conta/:path*", "/meus-pedidos/:path*", "/checkout/:path*"],
};
