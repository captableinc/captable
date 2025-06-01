import { Audit } from "@/server/audit";
import { getUserByEmail } from "@/server/user";
import { getVerificationTokenByToken } from "@/server/verification-token";
import { withoutAuth } from "@/trpc/api/trpc";
import { db, eq, users, verificationTokens } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const verifyEmailProcedure = withoutAuth
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    const { requestIp, userAgent } = ctx;
    const existingToken = await getVerificationTokenByToken(input);
    if (!existingToken) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Token does not exists!",
      });
    }
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Token expired!",
      });
    }

    const existingUser = await getUserByEmail(existingToken.identifier);

    if (!existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email does not exists!",
      });
    }

    const [user] = await db
      .update(users)
      .set({
        emailVerified: new Date(),
        email: existingToken.identifier,
      })
      .where(eq(users.id, existingUser.id))
      .returning();

    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update user",
      });
    }

    await Audit.create(
      {
        action: "user.verified",
        companyId: "",
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp: requestIp || "",
        },
        target: [{ type: "user", id: user.id }],
        summary: `${user.name} changed the password`,
      },
      db,
    );

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));

    return {
      success: true,
      message: "You're all set!",
    };
  });
