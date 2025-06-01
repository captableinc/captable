import { verifySecureHash } from "@/lib/crypto";
import { accessTokens, and, db, eq, members, users } from "@captable/db";
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
    const authHeader = c.req.header("Authorization");
    const bearerToken = authHeader?.replace("Bearer ", "").trim() ?? null;

    if (!bearerToken) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "Bearer token is invalid",
      });
    }

    await authenticateWithAccessToken(
      bearerToken,
      c,
      option?.withoutMembershipCheck,
    );

    await next();
  });

async function authenticateWithAccessToken(
  bearerToken: string,
  c: Context,
  withoutMembershipCheck: undefined | boolean,
) {
  const [clientId, clientSecret] = bearerToken.split(":") as [string, string];

  if (!clientId || !clientSecret) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Bearer token is invalid",
    });
  }

  const accessToken = await findAccessToken(clientId, c);

  if (!accessToken) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Bearer token is invalid",
    });
  }

  const isAccessTokenValid = await verifySecureHash(
    clientSecret,
    accessToken.clientSecret,
  );

  if (!isAccessTokenValid) {
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
  const companyId = c.req.param("companyId");

  if (!companyId || companyId === "") {
    throw new ApiError({
      code: "BAD_REQUEST",
      message: "Company id should be in the path",
    });
  }

  const [membership] = await db
    .select({
      id: members.id,
      companyId: members.companyId,
      role: members.role,
      customRoleId: members.customRoleId,
      userId: members.userId,
      user: {
        name: users.name,
        email: users.email,
      },
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .where(and(eq(members.companyId, companyId), eq(members.userId, userId)))
    .limit(1);

  if (!membership) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to access this resource",
    });
  }

  return membership;
}

function findAccessToken(clientId: string, _c: Context) {
  return db
    .select({
      clientId: accessTokens.clientId,
      clientSecret: accessTokens.clientSecret,
      userId: accessTokens.userId,
    })
    .from(accessTokens)
    .where(
      and(
        eq(accessTokens.clientId, clientId),
        eq(accessTokens.typeEnum, "api"),
        eq(accessTokens.active, true),
      ),
    )
    .limit(1)
    .then((results) => results[0] || null);
}
