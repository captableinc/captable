import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getRecoveryCodes } from "./get-recovery-code";
import { verifyTwoFactorAuthenticationToken } from "./verify-token";

type EnableTwoFactorAuthenticationOptions = {
  db: PrismaClient;
  userId: string;
  code: string;
};

export const enableTwoFactorAuthentication = async ({
  db,
  userId,
  code,
}: EnableTwoFactorAuthenticationOptions) => {
  const foundUser = await db.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (foundUser.twoFactorEnabled) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "TWO_FACTOR_ALREADY_ENABLED",
    });
  }

  if (!foundUser.twoFactorSecret) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "TWO_FACTOR_SETUP_REQUIRED",
    });
  }

  const isValidToken = await verifyTwoFactorAuthenticationToken({
    user: foundUser,
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
        id: foundUser.id,
      },
      data: {
        twoFactorEnabled: true,
      },
    });

    const recoveryCodes = getRecoveryCodes({ user: updatedUser }) ?? [];

    if (recoveryCodes.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "MISSING_BACKUP_CODE",
      });
    }

    //@TODO(2FA__ENABLED__AUDIT)

    return { recoveryCodes };
  });

  return { recoveryCodes };
};
