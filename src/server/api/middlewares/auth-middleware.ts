import { ApiKey } from "@/lib/api-key";
import { db } from "@/server/db";
import { ApiError } from "../error";
import type { Middleware } from "../hono";

export function authMiddleware(): Middleware {
  return async (c, next) => {
    const Key = new ApiKey();
    const bearerToken =
      c.req.header("Authorization")?.replace("Bearer ", "").trim() ?? null;

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

    const hashedKey = Key.generateHash(bearerToken);
    const newKey = Key.generateHash(ApiKey.generateKey().key);

    const apiKey = await db.apiKey.findFirst({
      where: { hashedKey },
      select: {
        hashedKey: true,
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

    const verified = Key.verifyHash(apiKey?.hashedKey ?? newKey, bearerToken);

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
