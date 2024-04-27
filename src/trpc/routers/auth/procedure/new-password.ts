import { publicProcedure } from "@/trpc/api/trpc";
import { ZNewPasswordProcedureSchema } from "../schema";
import { getPasswordResetTokenByToken } from "@/server/password-reset-token";
import { TRPCError } from "@trpc/server";
import { getUserByEmail } from "@/server/user";
import bcrypt from "bcryptjs";
export const newPasswordProcedure = publicProcedure
  .input(ZNewPasswordProcedureSchema)
  .mutation(async ({ ctx, input }) => {
    const { token, password } = input;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token!",
      });
    }
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Token expired!",
      });
    }
    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Email not found!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await ctx.db.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
      },
    });

    await ctx.db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return {
      success: true,
      message: "Your password has been updated successfully.",
    };
  });
