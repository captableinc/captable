import { env } from "@/env";
import { Decrypted } from "@/lib/crypto";
import type { User } from "@prisma/client";
import { base32 } from "@scure/base";
import { TOTPController } from "oslo/otp";

const totp = new TOTPController();

type VerifyTwoFactorAuthenticationTokenOptions = {
  user: User;
  totpCode: string;
};

export const verifyTwoFactorAuthenticationToken = async ({
  user,
  totpCode,
}: VerifyTwoFactorAuthenticationTokenOptions) => {
  const key = env.ENCRYPTION_KEY;

  if (!user.twoFactorSecret) {
    throw new Error("user missing 2fa secret");
  }

  const secret = Buffer.from(
    Decrypted({ key, data: user.twoFactorSecret }),
  ).toString("utf-8");

  const isValidToken = await totp.verify(totpCode, base32.decode(secret));

  return isValidToken;
};
