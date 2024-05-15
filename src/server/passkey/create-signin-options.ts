import { getAuthenticatorOptions } from "@/lib/authenticator";
import { db } from "@/server/db";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

type CreatePasskeySigninOptions = {
  sessionId: string;
};

export const createPasskeySigninOptions = async ({
  sessionId,
}: CreatePasskeySigninOptions) => {
  const { rpId, timeout } = getAuthenticatorOptions();

  const options = await generateAuthenticationOptions({
    rpID: rpId,
    userVerification: "preferred",
    timeout,
  });

  const { challenge } = options;

  await db.passkeyVerificationToken.upsert({
    where: {
      id: sessionId,
    },
    update: {
      token: challenge,
      expiresAt: new Date(new Date().getTime() + 2 * 60000), // 2 min expiry
      createdAt: new Date(),
    },
    create: {
      id: sessionId,
      token: challenge,
      expiresAt: new Date(new Date().getTime() + 2 * 60000), // 2 min expiry
      createdAt: new Date(),
    },
  });

  return options;
};
