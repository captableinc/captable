import { generateAccessToken, verifyAccessToken } from "@/lib/access-token";
import { decodeToken, hashToken } from "@/lib/tokens";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { ApiError } from "../error";

export const accessTokenAuthMiddleware = () =>
  createMiddleware(async (c, next) => {
    const bearerToken = extractBearerToken(c.req.header("Authorization"));

    if (bearerToken) {
      await authenticateWithAccessToken(bearerToken, c);
    }
    await next();
  });

function extractBearerToken(authHeader: string | undefined): string | null {
  return authHeader?.replace("Bearer ", "").trim() ?? null;
}

async function authenticateWithAccessToken(bearerToken: string, c: Context) {
  const { identifier, passkey } = extractApiKey(bearerToken);

  const apiKey = await findAccessToken(identifier, c);

  const isKeyValid = await verifyAccessToken(
    { identifier, passkey },
    apiKey?.hashedToken ??
      (await hashToken(generateAccessToken().encodedToken)),
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

function findAccessToken(identifier: string, c: Context) {
  const { db } = c.get("services");
  const companyId = c.req.param("companyId");

  return db.$transaction(async (tx) => {
    const accessToken = await tx.accessToken.findFirst({
      where: { id: identifier },
      select: {
        hashedToken: true,
        userId: true,
      },
    });

    const membership = await tx.member.findFirst({
      where: { companyId, userId: accessToken?.userId ?? "" },
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
    });

    if (membership && accessToken) {
      const { hashedToken } = accessToken;
      const { id: memberId, ...rest } = membership;

      return { hashedToken, membership: { memberId, ...rest } };
    }

    return null;
  });
}

function extractApiKey(bearerToken: string) {
  const decodedKey = decodeToken(bearerToken.split("_")[1] ?? "");

  return decodedKey;
}
