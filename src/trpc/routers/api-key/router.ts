import { generatePublicId } from "@/common/id";
import { createApiToken, createSecureHash } from "@/lib/crypto";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";

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
});
