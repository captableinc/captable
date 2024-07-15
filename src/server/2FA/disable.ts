import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { validateTwoFactorAuthentication } from "./validate";

type DisableTwoFactorAuthenticationOptions = {
  userId: string;
  token: string;
};

export const disableTwoFactorAuthentication = async ({
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
      recoveryCode: token,
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
