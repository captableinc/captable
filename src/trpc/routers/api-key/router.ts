import { generateAccessToken, hashAccessToken } from "@/lib/access-token";

import { Audit } from "@/server/audit";

import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const apiKeyRouter = createTRPCRouter({
  listAll: withAccessControl.query(async ({ ctx }) => {
    const {
      db,
      membership: { userId },
    } = ctx;

    const apiKeys = await db.accessToken.findMany({
      where: {
        active: true,
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        partialToken: true,
        createdAt: true,
        lastUsed: true,
      },
    });

    return {
      apiKeys,
    };
  }),
  create: withAccessControl.mutation(async ({ ctx }) => {
    const {
      db,
      membership: { userId, companyId },
      userAgent,
      requestIp,
      session,
    } = ctx;

    const {
      partialToken,
      identifier,
      tokenWithPrefix: keyWithPrefix,
      tokenPasskey: passkey,
    } = generateAccessToken();

    const hashedToken = await hashAccessToken({ identifier, passkey });
    const user = session.user;

    const key = await db.accessToken.create({
      data: {
        userId,
        partialToken,
        hashedToken,
        id: identifier,
      },
    });

    await Audit.create(
      {
        action: "apiKey.created",
        companyId,
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "apiKey", id: key.id }],
        summary: `${user.name} created the apiKey ${key.name}`,
      },
      db,
    );

    return {
      token: keyWithPrefix,
      partialKey: partialToken,
      createdAt: key.createdAt,
    };
  }),

  delete: withAccessControl
    .input(z.object({ keyId: z.string() }))
    .meta({ policies: { "api-keys": { allow: ["delete"] } } })
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        membership: { userId, companyId },
        session,
        requestIp,
        userAgent,
      } = ctx;
      const { keyId } = input;
      const { user } = session;
      try {
        const key = await db.accessToken.delete({
          where: {
            id: keyId,
            userId,
          },
        });
        await Audit.create(
          {
            action: "apiKey.deleted",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "apiKey", id: key.id }],
            summary: `${user.name} deleted the apiKey ${key.name}`,
          },
          db,
        );

        return {
          success: true,
          message: "Key deleted Successfully.",
        };
      } catch (error) {
        console.error("Error deleting the api key :", error);
        if (error instanceof TRPCError) {
          return {
            success: false,
            message: error.message,
          };
        }
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),
});
