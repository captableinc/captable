import { createApiToken, createSecureHash } from "@/lib/crypto";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";

export const apiKeyRouter = createTRPCRouter({
  create: withAuth.mutation(async ({ ctx }) => {
    const { db, session } = ctx;
    const user = session.user;

    const data = await db.$transaction(async (tx) => {
      const token = await createApiToken();
      const hashedToken = await createSecureHash(token);

      const key = await tx.apiKey.create({
        data: {
          userId: user.id,
          hashedToken,
        },
      });

      return {
        id: key.id,
        token,
        createdAt: key.createdAt,
      };
    });

    return data;
  }),
});
