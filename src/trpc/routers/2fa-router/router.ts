import { Send2FARecoveryCodesEmail } from "@/jobs/2fa-recovery-codes-email";
import { Send2FADisabledEmail } from "@/jobs/two-factor-disabled-email";
import { Send2FAEnabledEmail } from "@/jobs/two-factor-enabled-email";
import { disableTwoFactorAuthentication } from "@/server/2FA/disable";
import {
  type ExtendedUser,
  enableTwoFactorAuthentication,
} from "@/server/2FA/enable";
import { setupTwoFactorAuthentication } from "@/server/2FA/setup";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const twoFactorAuthRouter = createTRPCRouter({
  setup: withAuth.mutation(async ({ ctx: { session } }) => {
    try {
      const { user } = session;
      const { secret, uri } = await setupTwoFactorAuthentication({
        user: {
          id: user.id,
          email: user.email as string,
        },
      });
      return {
        success: true,
        data: { secret, uri },
        message: "2FA setuped successfully.",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        message:
          "Unable to setup two factor authentication. Please try again later.",
      };
    }
  }),

  enable: withAuth
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx: { session, db }, input }) => {
      try {
        const { user } = session;
        const foundUser = await db.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            blocked: true,
          },
        });

        const { recoveryCodes } = await enableTwoFactorAuthentication({
          user: foundUser as ExtendedUser,
          code: input.code,
        });

        await Send2FAEnabledEmail({
          email: user.email as string,
          userName: user.name || "",
          companyName: "",
        });
        return {
          success: true,
          data: recoveryCodes,
          message: "Successfully enabled the 2FA authentication.",
        };
      } catch (error) {
        console.error(error);
        if (error instanceof TRPCError) {
          return {
            success: false,
            data: null,
            message: error.message,
          };
        }
        return {
          success: false,
          data: null,
          message:
            "Failed enabling the two factor authentication.Please try again later",
        };
      }
    }),

  disable: withAuth
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx: { session }, input }) => {
      try {
        const { user } = session;
        await disableTwoFactorAuthentication({
          userId: user.id,
          token: input.code,
        });

        await Send2FADisabledEmail({
          email: user.email as string,
          userName: user.name || "",
          companyName: "",
        });
        return {
          success: true,
          message: "Successfully disabled the 2FA authentication.",
        };
      } catch (error) {
        console.error(error);
        if (error instanceof TRPCError) {
          return {
            success: false,
            message: error.message,
          };
        }
        return {
          success: false,
          error:
            "Failed disabling the two factor authentication.Please try again later",
        };
      }
    }),

  sendRecoveryCodes: withAuth
    .input(z.object({ recoveryCodes: z.array(z.string()) }))
    .mutation(async ({ ctx: { session }, input }) => {
      try {
        const payload = {
          email: session.user.email as string,
          recoveryCodes: input.recoveryCodes,
        };

        await Send2FARecoveryCodesEmail(payload);
        return {
          success: true,
          message: "Successfully, sent to registered email.",
        };
      } catch (error) {
        console.error(error);
        if (error instanceof TRPCError) {
          return {
            success: false,
            message: error.message,
          };
        }
        return {
          success: false,
          error: "Failed sending the recovery codes.Please try again later",
        };
      }
    }),
});
