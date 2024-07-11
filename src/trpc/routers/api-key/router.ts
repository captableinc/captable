import { generatePublicId } from "@/common/id";
import { createApiToken, createSecureHash } from "@/lib/crypto";
import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const apiKeyRouter = createTRPCRouter({
  listAll: withAccessControl
    .meta({ policies: { "api-keys": { allow: ["read"] } } })
    .query(async ({ ctx }) => {
      const {
        db,
        membership: { companyId, memberId },
      } = ctx;

      const apiKeys = await db.apiKey.findMany({
        where: {
          active: true,
          companyId,
          membershipId: memberId,
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          keyId: true,
          createdAt: true,
          lastUsed: true,
        },
      });

      return {
        apiKeys,
      };
    }),
  create: withAccessControl
    .meta({ policies: { "api-keys": { allow: ["create"] } } })
    .mutation(async ({ ctx }) => {
      const {
        db,
        membership: { companyId, memberId },
      } = ctx;

      const token = createApiToken();
      const keyId = generatePublicId();
      const hashedToken = createSecureHash(token);

      const key = await db.apiKey.create({
        data: {
          keyId,
          companyId,
          membershipId: memberId,
          hashedToken,
        },
      });

      return {
        token,
        keyId: key.keyId,
        createdAt: key.createdAt,
      };
    }),

  delete: withAccessControl
    .input(z.object({ keyId: z.string() }))
    .meta({ policies: { "api-keys": { allow: ["delete"] } } })
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        membership: { memberId, companyId },
      } = ctx;
      const { keyId } = input;
      try {
        await db.apiKey.delete({
          where: {
            keyId,
            membershipId: memberId,
            companyId,
          },
        });

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
