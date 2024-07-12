import { type PrismaClient, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { validateTwoFactorAuthentication } from "./validate";

type DisableTwoFactorAuthenticationOptions = {
  db: PrismaClient;
  userId: string;
  token: string;
};

export const disableTwoFactorAuthentication = async ({
  db,
  userId,
  token,
}: DisableTwoFactorAuthenticationOptions) => {
  const foundUser = await db.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  let isValid = await validateTwoFactorAuthentication({
    totpCode: token,
    user: foundUser,
  });

  if (!isValid) {
    isValid = await validateTwoFactorAuthentication({
      backupCode: token,
      user: foundUser,
    });
  }

  if (!isValid) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "INCORRECT_TWO_FACTOR_CODE",
    });
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: foundUser.id,
      },
      data: {
        twoFactorEnabled: false,
        twoFactorBackupCodes: null,
        twoFactorSecret: null,
      },
    });

    //@TODO(2FA_DISABLED_AUDIT)
  });

  return true;
};
