import { invariant } from "@/lib/error";
import { getPermissions } from "@/server/member";
import type { Session } from "@captable/auth/types";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { ApiError } from "../error";

export const sessionCookieAuthMiddleware = () =>
  createMiddleware(async (c, next) => {
    await authenticateWithSessionCookie(c);
    await next();
  });

export async function authenticateWithSessionCookie(c: Context) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    invariant(baseUrl);

    // Better Auth uses different cookie names
    const captableSessionCookie = getCookie(c, "captable-session");

    if (!captableSessionCookie) {
      throw new Error("Session cookie not found");
    }

    await validateSessionCookie(baseUrl, c);
  } catch (_error) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Failed to authenticate with session cookie",
    });
  }
}

function _determineCookieName(baseUrl: string): string {
  return baseUrl.startsWith("https://")
    ? "captable-session"
    : "captable-session-dev";
}

async function validateSessionCookie(baseUrl: string, c: Context) {
  const session = await fetchSessionFromAuthUrl(baseUrl, c);
  const companyIdParam = c.req.param("companyId");
  const { db } = c.get("services");

  const { err, val } = await getPermissions({
    db,
    session: {
      ...session,
      user: {
        ...session.user,
        ...(companyIdParam && { companyId: companyIdParam }),
      },
    },
  });

  if (err || !val) {
    throw err || new Error("Failed to get permissions");
  }

  c.set("session", { membership: val.membership });
}

async function fetchSessionFromAuthUrl(
  baseUrl: string,
  c: Context,
): Promise<Session> {
  const rawRequest = c.req.raw;
  const clonedRequest = rawRequest.clone();

  // Better Auth session endpoint
  const newUrl = new URL("/api/auth/session", baseUrl).toString();

  const response = await fetch(
    new Request(newUrl, {
      method: "GET",
      headers: clonedRequest.headers,
      body: clonedRequest.body,
    }),
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch session from auth service");
  }

  return data as Session;
}
