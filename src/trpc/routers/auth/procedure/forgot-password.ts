import { publicProcedure } from "@/trpc/api/trpc";
import { z } from "zod";
import { getUserByEmail } from "@/server/user";
import { TRPCError } from "@trpc/server";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/mail";

export const forgotPasswordProcedure = publicProcedure
  .input(z.string().email())
  .mutation(async ({ input }) => {
    const existingUser = await getUserByEmail(input);

    if (!existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email not found!",
      });
    }
    const passwordResetToken = await generatePasswordResetToken(input);
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );

    return {
      success: true,
      message:
        "To reset your password, please click the link sent to your email.",
    };
  });
