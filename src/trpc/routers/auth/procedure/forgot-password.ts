import {
  type TPasswordResetPayloadSchema,
  sendPasswordResetEmail,
  triggerName,
} from "@/jobs/password-reset-email";
import { generatePasswordResetToken } from "@/lib/token";
import { getUserByEmail } from "@/server/user";
import { getTriggerClient } from "@/trigger";
import { withoutAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const forgotPasswordProcedure = withoutAuth
  .input(z.string().email())
  .mutation(async ({ input }) => {
    const trigger = getTriggerClient();

    const existingUser = await getUserByEmail(input);

    if (!existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email not found!",
      });
    }
    const { email, token } = await generatePasswordResetToken(input);

    const payload: TPasswordResetPayloadSchema = {
      email,
      token,
    };

    if (trigger) {
      await trigger.sendEvent({ name: triggerName, payload });
    } else {
      await sendPasswordResetEmail(payload);
    }

    return {
      success: true,
      message:
        "To reset your password, please click the link sent to your email.",
    };
  });
