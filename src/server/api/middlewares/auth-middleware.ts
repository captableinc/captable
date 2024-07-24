import { generateApiKey, hashKey, verifyKey } from "@/lib/api-key";
import { invariant } from "@/lib/error";
import { getPermissions } from "@/lib/rbac/access-control";
import { getCookie } from "hono/cookie";
import type { Session } from "next-auth";
import { ApiError } from "../error";
import type { Context, Middleware } from "../hono";

export function authMiddleware(): Middleware {
  return async (c, next) => {
    const bearerToken = extractBearerToken(c.req.header("Authorization"));

    if (bearerToken) {
      await authenticateWithBearerToken(bearerToken, c);
    } else {
      await authenticateWithSessionCookie(c);
    }

    await next();
  };
}

function extractBearerToken(authHeader: string | undefined): string | null {
  return authHeader?.replace("Bearer ", "").trim() ?? null;
}

async function authenticateWithBearerToken(bearerToken: string, c: Context) {
  const apiKey = await findApiKey(bearerToken, c);

  const isKeyValid = isValidApiKey(bearerToken, apiKey?.hashedKey);

  if (!isKeyValid || !apiKey) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Invalid API token",
    });
  }

  c.set("session", {
    membership: apiKey.membership,
  });
}

async function authenticateWithSessionCookie(c: Context) {
  try {
    const authUrl = process.env.NEXTAUTH_URL;
    invariant(authUrl);

    const nextAuthcookieName = determineCookieName(authUrl);
    const nextAuthCookie = getCookie(c, nextAuthcookieName);

    if (!nextAuthCookie) {
      throw new Error("auth cooke not found");
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
  const { err, val } = await getPermissions({
    db: c.get("services").db,
    session,
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
      body: clonedRequest.body,
    }),
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch session from auth service");
  }

  return data as Session;
}

async function findApiKey(bearerToken: string, c: Context) {
  const { db } = c.get("services");

  const hashedKey = hashKey(bearerToken);

  const data = await db.apiKey.findFirst({
    where: { hashedKey },
    select: {
      hashedKey: true,
      member: {
        select: {
          id: true,
          companyId: true,
          role: true,
          customRoleId: true,
          userId: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (data) {
    const {
      hashedKey,
      member: { id: memberId, ...rest },
    } = data;
    return { hashedKey, membership: { memberId, ...rest } };
  }

  return data;
}

function isValidApiKey(bearerToken: string, hashedKey?: string | null) {
  const randomHash = hashKey(generateApiKey().key);
  const verified = verifyKey(bearerToken, hashedKey ?? randomHash);

  return verified;
}
