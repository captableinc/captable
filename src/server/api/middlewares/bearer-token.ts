import { generateAccessToken, verifyAccessToken } from "@/lib/access-token";
import { decodeToken, hashToken } from "@/lib/tokens";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { ApiError } from "../error";

export type accessTokenAuthMiddlewareOptions =
  | {
      withoutMembershipCheck?: boolean;
    }
  | undefined;

export const accessTokenAuthMiddleware = (
  option?: accessTokenAuthMiddlewareOptions,
) =>
  createMiddleware(async (c, next) => {
    const bearerToken = extractBearerToken(c.req.header("Authorization"));

    if (bearerToken) {
      await authenticateWithAccessToken(
        bearerToken,
        c,
        option?.withoutMembershipCheck,
      );
    }
    await next();
  });

function extractBearerToken(authHeader: string | undefined): string | null {
  return authHeader?.replace("Bearer ", "").trim() ?? null;
}

async function authenticateWithAccessToken(
  bearerToken: string,
  c: Context,
  withoutMembershipCheck: undefined | boolean,
) {
  const { identifier, passkey } = extractApiKey(bearerToken);

  const accessToken = await findAccessToken(identifier, c);

  const isKeyValid = await verifyAccessToken(
    { identifier, passkey },
    accessToken?.hashedToken ??
      (await hashToken(generateAccessToken().encodedToken)),
  );

  if (!isKeyValid || !accessToken) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Bearer token is invalid",
    });
  }

  if (withoutMembershipCheck) {
    c.set("session", {
      // @ts-expect-error
      membership: {
        userId: accessToken.userId,
      },
    });
  }

  if (!withoutMembershipCheck) {
    const { id: memberId, ...rest } = await checkMembership(
      accessToken.userId,
      c,
    );
    c.set("session", {
      membership: { memberId, ...rest },
    });
  }
}

async function checkMembership(userId: string, c: Context) {
  const { db } = c.get("services");
  const companyId = c.req.param("companyId");

  if (!companyId || companyId === "") {
    throw new ApiError({
      code: "BAD_REQUEST",
      message: "Company id should be in the path",
    });
  }

  const membership = await db.member.findFirst({
    where: { companyId, userId },
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

  if (!membership) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to access this resource",
    });
  }

  return membership;
}

function findAccessToken(identifier: string, c: Context) {
  const { db } = c.get("services");

  return db.accessToken.findFirst({
    where: { id: identifier },
    select: {
      hashedToken: true,
      userId: true,
    },
  });
}

function extractApiKey(bearerToken: string) {
  const decodedKey = decodeToken(bearerToken.split("_")[1] ?? "");

  return decodedKey;
}
