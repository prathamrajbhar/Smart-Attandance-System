import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "sas-auth-storage";

function parseAuthCookie(request: NextRequest): { token: string | null; role: string | null } {
  const cookie = request.cookies.get(AUTH_COOKIE);
  if (!cookie?.value) return { token: null, role: null };

  const attempts = [
    () => JSON.parse(cookie.value),
    () => JSON.parse(decodeURIComponent(cookie.value)),
  ];

  for (const parseFn of attempts) {
    try {
      const parsed = parseFn();
      if (parsed?.state) {
        return {
          token: parsed.state.token || null,
          role: parsed.state.user?.role || null,
        };
      }
    } catch {
      // try next attempt
    }
  }

  return { token: null, role: null };
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/onboarding",
    "/api",
    "/_next",
    "/favicon.ico",
  ];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const { token, role } = parseAuthCookie(request);

  if (pathname === "/") {
    if (token) {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      if (role === "TEACHER") {
        return NextResponse.redirect(new URL("/teacher/classes", request.url));
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && role) {
    if (role === "STUDENT") {
      if (pathname.startsWith("/admin") || pathname.startsWith("/teacher")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    if (role !== "ADMIN" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/teacher/classes", request.url));
    }
    if (role !== "TEACHER" && pathname.startsWith("/teacher")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
