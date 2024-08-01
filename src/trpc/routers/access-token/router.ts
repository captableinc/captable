import { generateAccessToken, hashAccessToken } from "@/lib/access-token";

import { Audit } from "@/server/audit";

import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const accessTokenRouter = createTRPCRouter({
  listAll: withAccessControl.query(async ({ ctx }) => {
    const {
      db,
      membership: { userId },
    } = ctx;

    const accessTokens = await db.accessToken.findMany({
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
      accessTokens,
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
        action: "accessToken.created",
        companyId,
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "accessToken", id: key.id }],
        summary: `${user.name} created an access token - ${partialToken}`,
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
    .input(z.object({ tokenId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        membership: { userId, companyId },
        session,
        requestIp,
        userAgent,
      } = ctx;
      const { tokenId } = input;
      const { user } = session;
      try {
        const key = await db.accessToken.delete({
          where: {
            id: tokenId,
            userId,
          },
        });
        await Audit.create(
          {
            action: "accessToken.deleted",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "accessToken", id: key.id }],
            summary: `${user.name} deleted an access token - ${key.partialToken}`,
          },
          db,
        );

        return {
          success: true,
          message: "Key deleted Successfully.",
        };
      } catch (error) {
        console.error("Error deleting the access token :", error);
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
