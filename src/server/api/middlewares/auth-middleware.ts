import { generateApiKey, verifyApiKey } from "@/lib/api-key";
import { decodeToken, hashToken } from "@/lib/tokens";
import { ApiError } from "../error";
import type { Context, Middleware } from "../hono";
import { authenticateWithSessionCookie } from "./session-cookie-auth-middleware";

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
  const { identifier, passkey } = extractApiKey(bearerToken);

  const apiKey = await findApiKey(identifier, c);

  const isKeyValid = await verifyApiKey(
    { identifier, passkey },
    apiKey?.hashedKey ?? (await hashToken(generateApiKey().encodedToken)),
  );

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

async function findApiKey(identifier: string, c: Context) {
  const { db } = c.get("services");

  const data = await db.apiKey.findFirst({
    where: { id: identifier },
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

function extractApiKey(bearerToken: string) {
  const decodedKey = decodeToken(bearerToken.split("_")[1] ?? "");

  return decodedKey;
}
