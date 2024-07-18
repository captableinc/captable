import { ApiKey } from "@/lib/api-key";
import { db } from "@/server/db";
import { ApiError } from "../error";
import type { Middleware } from "../hono";

export function authMiddleware(): Middleware {
  return async (c, next) => {
    const bearerToken =
      c.req.header("Authorization")?.replace("Bearer ", "") ?? null;

    if (!bearerToken) {
      // @todo: handle next-auth cookie

      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "No bearer token provided",
      });
    }

    if (!ApiKey.isApiKey(bearerToken)) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "invalid api token",
      });
    }

    const hashToken = await ApiKey.generateHash(bearerToken);

    const apiKey = await db.apiKey.findFirst({
      where: { hashedToken: hashToken },
      select: {
        hashedToken: true,
        member: {
          select: {
            id: true,
            companyId: true,
            role: true,
            customRoleId: true,
          },
        },
      },
    });

    const verified = await ApiKey.verifyHash(
      apiKey?.hashedToken ?? ApiKey.generateKey(),
      bearerToken,
    );

    if (!verified || !apiKey) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "invalid api token",
      });
    }

    const membership = apiKey.member;

    c.set("membership", {
      companyId: membership.companyId,
      customRoleId: membership.customRoleId,
      memberId: membership.id,
      role: membership.role,
    });
    await next();
  };
}
