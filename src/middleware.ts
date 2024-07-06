import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { type NextRequest, userAgent } from "next/server";
import { env } from "./env";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (
    env.DEBUG ||
    env.NODE_ENV === "production" ||
    env.NODE_ENV === "staging"
  ) {
    const { url, ip, geo, method } = request;
    const time = new Date().toISOString();
    const { device, browser, isBot } = userAgent(request);

    logger.info({ method, time, url, ip, device, browser, geo, isBot });
  }
  return NextResponse.next();
}

export const config = {
  // Matcher ignores _next/static, _next/image, or favicon.ico
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
