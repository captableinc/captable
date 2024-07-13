import type { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { verifyRecoveryCode } from "./verify-recovery-code";
import { verifyTwoFactorAuthenticationToken } from "./verify-token";

type ValidateTwoFactorAuthenticationOptions = {
  user: User;
  totpCode?: string;
  recoveryCode?: string;
};

export const validateTwoFactorAuthentication = async ({
  recoveryCode,
  totpCode,
  user,
}: ValidateTwoFactorAuthenticationOptions) => {
  if (!user.twoFactorEnabled) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "TWO FACTOR SETUP REQUIRED",
    });
  }

  if (!user.twoFactorSecret) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "TWO FACTOR MISSING SECRET",
    });
  }

  if (totpCode) {
    return await verifyTwoFactorAuthenticationToken({ user, totpCode });
  }

  if (recoveryCode) {
    return await verifyRecoveryCode({ user, recoveryCode });
  }
};
