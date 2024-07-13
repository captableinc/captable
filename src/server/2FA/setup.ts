import crypto from "node:crypto";
import { CAPTABLE_ENCRYPTION_KEY } from "@/constants/crypto";
import { Encrypted } from "@/lib/cipher";
import type { PrismaClient } from "@prisma/client";
import { base32 } from "@scure/base";
import { TRPCError } from "@trpc/server";
import { createTOTPKeyURI } from "oslo/otp";

//

type SetupTwoFactorAuthenticationOptions = {
  db: PrismaClient;
  user: {
    id: string;
    email: string;
  };
};

const ISSUER = "Captable-inc";
const key = CAPTABLE_ENCRYPTION_KEY;

export const setupTwoFactorAuthentication = async ({
  db,
  user,
}: SetupTwoFactorAuthenticationOptions) => {
  if (!key) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Missing encryption key",
    });
  }

  const secret = crypto.randomBytes(10);

  const backupCodes = Array.from({ length: 10 })
    .fill(null)
    .map(() => crypto.randomBytes(5).toString("hex"))
    .map((code) => `${code.slice(0, 5)}-${code.slice(5)}`.toUpperCase());

  const accountName = user.email as string;

  const uri = createTOTPKeyURI(ISSUER, accountName, secret);

  const encodedSecret = base32.encode(secret);

  const twoFactorBackupCodes = Encrypted({
    key,
    data: JSON.stringify(backupCodes),
  });

  const twoFactorSecret = Encrypted({
    key,
    data: encodedSecret,
  });

  console.log({ uri });
  console.log({ secret });
  console.log({ encodedSecret });
  console.log({ twoFactorSecret });

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      twoFactorEnabled: false,
      twoFactorBackupCodes,
      twoFactorSecret,
    },
  });

  return {
    secret: encodedSecret,
    uri,
  };
};
