import { verifySecureHash } from "@/lib/crypto";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { nanoid } from "nanoid";
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

  const randomId = nanoid();

  const accessToken = await findAccessToken(clientId, c);

  const isAccessTokenValid = await verifySecureHash(
    clientSecret,
    accessToken?.clientSecret ?? randomId,
  );

  if (!isAccessTokenValid || !accessToken) {
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

function findAccessToken(clientId: string, c: Context) {
  const { db } = c.get("services");

  return db.accessToken.findFirst({
    where: {
      clientId,
      typeEnum: "api",
      active: true,
    },
    select: {
      clientId: true,
      clientSecret: true,
      userId: true,
    },
  });
}
