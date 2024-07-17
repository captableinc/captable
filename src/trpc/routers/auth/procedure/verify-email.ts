import { Audit } from "@/server/audit";
import { getUserByEmail } from "@/server/user";
import { getVerificationTokenByToken } from "@/server/verification-token";
import { withoutAuth } from "@/trpc/api/trpc";
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

    const user = await ctx.db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.identifier,
      },
    });

    const company = await ctx.db.member.findFirst({
      where: {
        userId: user.id,
      },
    });

    await Audit.create(
      {
        action: "user.verified",
        companyId: company?.id || "",
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "user", id: user.id }],
        summary: `${user.name} changed the password`,
      },
      ctx.db,
    );

    await ctx.db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return {
      success: true,
      message: "You're all set!",
    };
  });
