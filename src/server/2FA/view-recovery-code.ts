import type { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getRecoveryCodes } from "./get-recovery-code";
import { validateTwoFactorAuthentication } from "./validate";

type ViewBackupCodesOptions = {
  user: User;
  token: string;
};

export const viewRecoveryCodes = async ({
  token,
  user,
}: ViewBackupCodesOptions) => {
  let isValid = await validateTwoFactorAuthentication({
    totpCode: token,
    user,
  });

  if (!isValid) {
    isValid = await validateTwoFactorAuthentication({
      recoveryCode: token,
      user,
    });
  }

  if (!isValid) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "INCORRECT_TWO_FACTOR_CODE",
    });
  }

  const recoveryCodes = getRecoveryCodes({ user });

  if (!recoveryCodes) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "MISSING_BACKUP_CODE",
    });
  }

  return recoveryCodes;
};
