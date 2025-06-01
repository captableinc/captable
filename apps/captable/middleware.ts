import { logger } from "@captable/logger";
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import { type NextRequest, userAgent } from "next/server";
import { env } from "./env";

const log = logger.child({ module: "middleware" });

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/onboarding",
  "/company",
  "/documents",
  "/esign",
];

// Public routes that should redirect to dashboard if authenticated
const authRoutes = ["/login", "/signup", "/new"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log request if enabled
  if (env.LOGS || env.NODE_ENV === "production") {
    const { url, method } = request;
    const time = new Date().toISOString();
    const { device, browser, isBot } = userAgent(request);

    log.info({ method, time, url, device, browser, isBot });
  }

  // Check for session cookie using Better Auth helper
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "captable", // Match the prefix from auth config
  });

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignores _next/static, _next/image, favicon.ico, and API routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
