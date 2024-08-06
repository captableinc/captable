import { db } from "@/server/db";
import type { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getRecoveryCodes } from "./get-recovery-code";
import { verifyTwoFactorAuthenticationToken } from "./verify-token";

export type ExtendedUser = User & {
  blocked: {
    id: string;
    userId: string;
    cause: string | null;
    blockedAt: Date;
  };
};

type EnableTwoFactorAuthenticationOptions = {
  user: ExtendedUser;
  code: string;
};

export const enableTwoFactorAuthentication = async ({
  user,
  code,
}: EnableTwoFactorAuthenticationOptions) => {
  if (user.twoFactorEnabled) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "TWO_FACTOR_ALREADY_ENABLED",
    });
  }

  if (!user.twoFactorSecret) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "TWO_FACTOR_SETUP_REQUIRED",
    });
  }

  const isValidToken = await verifyTwoFactorAuthenticationToken({
    user: user,
    totpCode: code,
  });

  if (!isValidToken) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "INCORRECT_TWO_FACTOR_CODE",
    });
  }

  const { recoveryCodes } = await db.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFactorEnabled: true,
        failedAuthAttempts: 0,
      },
    });

    const recoveryCodes = getRecoveryCodes({ user: updatedUser }) ?? [];

    if (recoveryCodes.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "MISSING_BACKUP_CODE",
      });
    }

    //@TODO(2FA__ENABLED__AUDIT__EVENT)

    return { recoveryCodes };
  });

  return { recoveryCodes };
};
