import { sendAuthVerificationEmail } from "@/jobs/auth-verification-email";

import { generateVerificationToken } from "@/lib/token";
import { Audit } from "@/server/audit";
import { withoutAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { ZSignUpMutationSchema } from "../schema";

export const signupProcedure = withoutAuth
  .input(ZSignUpMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { name, email, password } = input;
    const { userAgent, requestIp } = ctx;
    const userExists = await ctx.db.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (userExists) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await ctx.db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const company = await ctx.db.member.findFirst({
      where: {
        userId: user.id,
      },
    });

    await Audit.create(
      {
        action: "apiKey.created",
        companyId: company?.id || "",
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "user", id: user.id }],
        summary: `${user.name} has created the Account`,
      },
      ctx.db,
    );

    const verificationToken = await generateVerificationToken(email);

    await sendAuthVerificationEmail({
      email: verificationToken.identifier,
      token: verificationToken.token,
    });

    return {
      success: true,
      message: "Please check your email to verify your account.",
    };
  });
