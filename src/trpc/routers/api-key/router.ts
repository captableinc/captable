import { generatePublicId } from "@/common/id";
import { createApiToken, createSecureHash } from "@/lib/crypto";
import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const apiKeyRouter = createTRPCRouter({
  create: withAccessControl
    .meta({ policies: { "api-keys": { allow: ["create"] } } })
    .mutation(async ({ ctx }) => {
      const { db, session } = ctx;
      const user = session.user;

      const token = createApiToken();
      const keyId = generatePublicId();
      const hashedToken = createSecureHash(token);

      const key = await db.apiKey.create({
        data: {
          keyId,
          userId: user.id,
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
      const { db } = ctx;
      const { keyId } = input;
      try {
        await db.apiKey.delete({
          where: {
            keyId,
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
