import { withAuth } from "@/trpc/api/trpc";
import { ZChangePasswordMutationSchema } from "../schema";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
export const changePasswordProcedure = withAuth
  .input(ZChangePasswordMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { currentPassword, newPassword } = input;

    const oldPassword = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        password: true,
      },
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await ctx.db.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return {
      success: true,
      message: "You've successfully changed your password.",
    };
  });
