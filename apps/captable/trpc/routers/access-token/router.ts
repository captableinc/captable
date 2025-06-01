import { createSecureHash, initializeAccessToken } from "@/lib/crypto";
import { Audit } from "@/server/audit";
import {
  AccessTokenTypeEnum,
  accessTokens,
  and,
  db,
  desc,
  eq,
} from "@captable/db";

import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

const accessTokenTypeEnum = z.union(
  // @ts-expect-error - AccessTokenTypeEnum.enumValues is not typed correctly
  AccessTokenTypeEnum.enumValues.map((value) => z.literal(value)),
);

export const accessTokenRouter = createTRPCRouter({
  listAll: withAccessControl
    .input(
      z.object({
        typeEnum: accessTokenTypeEnum,
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        membership: { userId },
      } = ctx;

      const { typeEnum } = input;

      const accessTokensResult = await db
        .select({
          id: accessTokens.id,
          clientId: accessTokens.clientId,
          createdAt: accessTokens.createdAt,
          lastUsed: accessTokens.lastUsed,
        })
        .from(accessTokens)
        .where(
          and(
            eq(accessTokens.active, true),
            eq(accessTokens.userId, userId),
            eq(accessTokens.typeEnum, typeEnum as AccessTokenTypeEnum),
          ),
        )
        .orderBy(desc(accessTokens.createdAt));

      return {
        accessTokens: accessTokensResult,
      };
    }),

  create: withAccessControl
    .input(z.object({ typeEnum: accessTokenTypeEnum }))
    .mutation(async ({ ctx, input }) => {
      const {
        membership: { userId, companyId },
        userAgent,
        requestIp,
        session,
      } = ctx;

      const { typeEnum } = input;

      const { clientId, clientSecret } = initializeAccessToken({
        prefix: typeEnum,
      });

      const user = session.user;
      const hashedClientSecret = await createSecureHash(clientSecret);

      const [key] = await db
        .insert(accessTokens)
        .values({
          userId,
          typeEnum,
          clientId,
          clientSecret: hashedClientSecret,
          updatedAt: new Date(),
        })
        .returning();

      if (!key) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create access token",
        });
      }

      await Audit.create(
        {
          action: "accessToken.created",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp: requestIp ?? "",
          },
          target: [{ type: "accessToken", id: key.id }],
          summary: `${user.name} created an access token - ${clientId}`,
        },
        db,
      );

      return {
        token: `${clientId}:${clientSecret}`,
        partialKey: clientId,
        createdAt: key.createdAt,
      };
    }),

  delete: withAccessControl
    .input(z.object({ tokenId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const {
        membership: { userId, companyId },
        session,
        requestIp,
        userAgent,
      } = ctx;
      const { tokenId } = input;
      const { user } = session;
      try {
        const [key] = await db
          .delete(accessTokens)
          .where(
            and(eq(accessTokens.id, tokenId), eq(accessTokens.userId, userId)),
          )
          .returning();

        if (!key) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Access token not found",
          });
        }

        await Audit.create(
          {
            action: "accessToken.deleted",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp: requestIp ?? "",
            },
            target: [{ type: "accessToken", id: key.id }],
            summary: `${user.name} deleted an access token - ${key.clientId}`,
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
