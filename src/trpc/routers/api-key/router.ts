import { generatePublicId } from "@/common/id";
import { createApiToken, createSecureHash } from "@/lib/crypto";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";
export const apiKeyRouter = createTRPCRouter({
  create: withAuth.mutation(async ({ ctx }) => {
    const { db, session } = ctx;
    const user = session.user;

    const data = await db.$transaction(async (tx) => {
      const token = await createApiToken();
      const keyId = generatePublicId();
      const hashedToken = await createSecureHash(token);

      const key = await tx.apiKey.create({
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
    });

    return data;
  }),

  //TODO: put the schema in the schema file
  delete: withAuth
    .input(z.object({ keyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { db } = ctx;
        const { keyId } = input;

        await db.$transaction(async (tx) => {
          await tx.apiKey.delete({
            where: {
              keyId,
            },
          });
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
