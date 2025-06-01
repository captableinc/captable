import { Audit } from "@/server/audit";
import { getPasswordResetTokenByToken } from "@/server/password-reset-token";
import { getUserByEmail } from "@/server/user";
import { withoutAuth } from "@/trpc/api/trpc";
import { db, eq, passwordResetTokens, users } from "@captable/db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { ZNewPasswordProcedureSchema } from "../schema";

export const newPasswordProcedure = withoutAuth
  .input(ZNewPasswordProcedureSchema)
  .mutation(async ({ ctx, input }) => {
    const { token, password } = input;
    const { requestIp, userAgent } = ctx;
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

    const [user] = await db
      .update(users)
      .set({
        password: hashedPassword,
        // since the user can only reset using email, we can assume the email is verified
        emailVerified: new Date(),
      })
      .where(eq(users.id, existingUser.id))
      .returning();

    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update user password",
      });
    }

    await Audit.create(
      {
        action: "user.password-updated",
        companyId: "",
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp: requestIp || "",
        },
        target: [{ type: "user", id: user.id }],
        summary: `${user.name} updated the password`,
      },
      db,
    );

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));

    return {
      success: true,
      message: "Your password has been updated successfully.",
    };
  });
