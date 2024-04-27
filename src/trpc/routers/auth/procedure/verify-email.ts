import { getUserByEmail } from "@/server/user";
import { getVerificationTokenByToken } from "@/server/verification-token";
import { publicProcedure } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const verifyEmailProcedure = publicProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
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

    await ctx.db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.identifier,
      },
    });

    await ctx.db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return {
      success: true,
      message: "You're all set!",
    };
  });
