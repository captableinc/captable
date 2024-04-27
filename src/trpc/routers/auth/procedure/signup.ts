import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { publicProcedure } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { ZSignUpMutationSchema } from "../schema";

export const signupProcedure = publicProcedure
  .input(ZSignUpMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { name, email, password } = input;

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

    await ctx.db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );

    return {
      success: true,
      message: "Please check your email to verify your account.",
    };
  });
