import { disableTwoFactorAuthentication } from "@/server/2FA/disable";
import { enableTwoFactorAuthentication } from "@/server/2FA/enable";
import { setupTwoFactorAuthentication } from "@/server/2FA/setup";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const twoFactorAuthRouter = createTRPCRouter({
  setup: withAuth.mutation(async ({ ctx: { session, db } }) => {
    try {
      const { user } = session;
      const { secret, uri } = await setupTwoFactorAuthentication({
        db,
        user: {
          id: user.id,
          email: user.email as string,
        },
      });
      return {
        success: true,
        data: { secret, uri },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        error:
          "Unable to setup two factor authentication. Please try again later.",
      };
    }
  }),

  enable: withAuth
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx: { session, db }, input }) => {
      try {
        const { user } = session;
        const { recoveryCodes } = await enableTwoFactorAuthentication({
          db,
          userId: user.id,
          code: input.code,
        });
        return {
          success: true,
          recoveryCodes,
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
            "Failed enabling the two factor authentication.Please try again later",
        };
      }
    }),

  disable: withAuth
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx: { session, db }, input }) => {
      try {
        const { user } = session;
        await disableTwoFactorAuthentication({
          db,
          userId: user.id,
          token: input.code,
        });
        return {
          success: true,
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
});
