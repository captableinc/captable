import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import { db, eq, users } from "@captable/db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { ZUpdatePasswordMutationSchema } from "../schema";

export const updatePasswordProcedure = withAuth
  .input(ZUpdatePasswordMutationSchema)
  .mutation(async ({ ctx: { session, userAgent, requestIp }, input }) => {
    const companyId = session.user.companyId;
    const userId = session.user.id;
    const { currentPassword, newPassword } = input;

    const userResult = await db
      .select({
        password: users.password,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];
    if (!user?.password) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User has no password",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Current password is incorrect.",
      });
    }

    // Compare the new password with the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Your new password cannot be the same as your old password.",
      });
    }
    const SALT_ROUNDS = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedNewPassword,
        })
        .where(eq(users.id, userId));

      await Audit.create(
        {
          action: "password.updated",
          companyId,
          actor: { type: "user", id: userId },
          context: {
            userAgent,
            requestIp: requestIp || "",
          },
          target: [{ type: "user", id: userId }],
          summary: `${session.user.name} updated a new password.`,
        },
        tx,
      );
    });

    return {
      success: true,
      message: "You've successfully changed your password.",
    };
  });
