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

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;


  const publicPaths = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/onboarding",
    "/suspended",
    "/api",
    "/_next",
    "/favicon.ico",
  ];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const { token, role } = parseAuthCookie(request);

  const SUPER_ADMIN_ROLES = ["SUPER_ADMIN"];
  const ADMIN_ROLES = ["ADMIN", "TENANT_ADMIN"];
  const TEACHER_ROLES = ["TEACHER"];

  const isSuperAdmin = role ? SUPER_ADMIN_ROLES.includes(role) : false;
  const isAdmin = role ? ADMIN_ROLES.includes(role) : false;
  const isTeacher = role ? TEACHER_ROLES.includes(role) : false;

  const getDefaultDashboard = () => {
    if (isSuperAdmin) return "/super-admin/dashboard";
    if (isAdmin) return "/admin/dashboard";
    if (isTeacher) return "/teacher/classes";
    return "/login";
  };

  if (pathname === "/") {
    if (token && (isSuperAdmin || isAdmin || isTeacher)) {
      return NextResponse.redirect(new URL(getDefaultDashboard(), request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && role) {
    if (role === "STUDENT" || role === "PARENT") {
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/teacher") ||
        pathname.startsWith("/super-admin")
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    if (pathname.startsWith("/super-admin") && !isSuperAdmin) {
      return NextResponse.redirect(new URL(getDefaultDashboard(), request.url));
    }

    if (pathname.startsWith("/admin") && !isAdmin && !isSuperAdmin) {
      return NextResponse.redirect(new URL(getDefaultDashboard(), request.url));
    }

    if (pathname.startsWith("/teacher") && !isTeacher) {
      return NextResponse.redirect(new URL(getDefaultDashboard(), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
