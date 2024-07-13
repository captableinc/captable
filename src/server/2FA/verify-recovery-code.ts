import type { User } from "@prisma/client";
import { getRecoveryCodes } from "./get-recovery-code";

type VerifyBackupCodeParams = {
  user: User;
  recoveryCode: string;
};

export const verifyRecoveryCode = async ({
  user,
  recoveryCode,
}: VerifyBackupCodeParams) => {
  const userBackupCodes = await getRecoveryCodes({ user });

  if (!userBackupCodes) {
    throw new Error("User has no backup codes");
  }

  return userBackupCodes.includes(recoveryCode);
};
