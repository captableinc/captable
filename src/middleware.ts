import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { type NextRequest, userAgent } from "next/server";
import { env } from "./env";

const log = logger.child({ module: "middleware" });
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Log request details
  if (env.LOGS || env.NODE_ENV === "production" || env.NODE_ENV === "staging") {
    const { url, ip, geo, method } = request;
    const time = new Date().toISOString();
    const { device, browser, isBot } = userAgent(request);

    log.info({ method, time, url, ip, device, browser, geo, isBot });
  }

  // Get the response
  const response = NextResponse.next();

  // Add CORS headers to help with potential CORS issues
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  // Add debug header to identify middleware processing
  response.headers.set("X-Middleware-Debug", "true");

  return response;
}

export const config = {
  // Matcher ignores _next/static, _next/image, or favicon.ico
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
