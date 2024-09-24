import { invariant } from "@/lib/error";
import { getPermissions } from "@/lib/rbac/access-control";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type { Session } from "next-auth";
import { ApiError } from "../error";

export const sessionCookieAuthMiddleware = () =>
  createMiddleware(async (c, next) => {
    await authenticateWithSessionCookie(c);
    await next();
  });

export async function authenticateWithSessionCookie(c: Context) {
  try {
    const authUrl = process.env.NEXTAUTH_URL;
    invariant(authUrl);

    const nextAuthcookieName = determineCookieName(authUrl);
    const nextAuthCookie = getCookie(c, nextAuthcookieName);

    if (!nextAuthCookie) {
      throw new Error("Session cookie not found");
    }

    await validateSessionCookie(authUrl, c);
  } catch (_error) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Failed to authenticate with session cookie",
    });
  }
}

function determineCookieName(authUrl: string): string {
  return authUrl.startsWith("https://")
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
}

async function validateSessionCookie(authUrl: string, c: Context) {
  const session = await fetchSessionFromAuthUrl(authUrl, c);
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

  if (err) {
    throw err;
  }

  c.set("session", { membership: val.membership });
}

async function fetchSessionFromAuthUrl(
  authUrl: string,
  c: Context,
): Promise<Session> {
  const rawRequest = c.req.raw;
  const clonedRequest = rawRequest.clone();
  const newUrl = new URL("/api/auth/session", authUrl).toString();

  const response = await fetch(
    new Request(newUrl, {
      method: "GET",
      headers: clonedRequest.headers,
    }),
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch session from auth service");
  }

  return data as Session;
}
