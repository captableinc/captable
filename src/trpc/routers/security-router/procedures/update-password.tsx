import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import bcrypt from "bcryptjs";
import { ZUpdatePasswordMutationSchema } from "../schema";
export const updatePasswordProcedure = withAuth
  .input(ZUpdatePasswordMutationSchema)
  .mutation(async ({ ctx: { session, db, userAgent, requestIp }, input }) => {
    const companyId = session.user.companyId;
    const userId = session.user.id;
    const { currentPassword, newPassword } = input;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!user?.password) {
      throw new Error("User has no password");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect.");
    }

    // Compare the new password with the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error(
        "Your new password cannot be the same as your old password.",
      );
    }
    const SALT_ROUNDS = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedNewPassword,
        },
      });
      await Audit.create(
        {
          action: "password.updated",
          companyId,
          actor: { type: "user", id: userId },
          context: {
            userAgent,
            requestIp,
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
