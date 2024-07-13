import { CAPTABLE_ENCRYPTION_KEY } from "@/constants/crypto";
import { Decrypted } from "@/lib/cipher";
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
  const key = CAPTABLE_ENCRYPTION_KEY;

  if (!user.twoFactorSecret) {
    throw new Error("user missing 2fa secret");
  }

  const secret = Buffer.from(
    Decrypted({ key, data: user.twoFactorSecret }),
  ).toString("utf-8");

  console.log({ otp: totpCode });

  console.log({ firstDecrypt: secret });

  console.log({ secondDecrypt: base32.decode(secret) });

  const isValidToken = await totp.verify(totpCode, base32.decode(secret));

  console.log({ isValidToken });

  return isValidToken;
};
