import { CAPTABLE_ENCRYPTION_KEY } from "@/constants/crypto";
import { Decrypted } from "@/lib/cipher";
import type { User } from "@prisma/client";
import { z } from "zod";

interface GetRecoveryCodesOptions {
  user: User;
}

const key = CAPTABLE_ENCRYPTION_KEY;

const ZBackupCodeSchema = z.array(z.string());

export const getRecoveryCodes = ({ user }: GetRecoveryCodesOptions) => {
  if (!user.twoFactorEnabled) {
    throw new Error("User has not enabled 2FA");
  }

  if (!user.twoFactorBackupCodes) {
    throw new Error("User has no backup codes");
  }

  const secret = Buffer.from(
    Decrypted({ data: user.twoFactorBackupCodes, key }),
  ).toString("utf-8");

  //@ts-ignore
  const data = JSON.parse(secret);
  const result = ZBackupCodeSchema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  return null;
};