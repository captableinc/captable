import { getAuthenticatorOptions } from "@/lib/authenticator";
import { db } from "@/server/db";
import { type Passkey } from "@prisma/client";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";

type CreatePasskeyAuthenticationOptions = {
  userId: string;
  /**
   * The ID of the passkey to request authentication for.
   *
   * If not set, we allow the browser client to handle choosing.
   */
  preferredPasskeyId?: string;
};

export const createPasskeyAuthenticationOptions = async ({
  userId,
  preferredPasskeyId,
}: CreatePasskeyAuthenticationOptions) => {
  const { rpId, timeout } = getAuthenticatorOptions();

  let preferredPasskey: Pick<Passkey, "transports" | "credentialId"> | null =
    null;

  if (preferredPasskeyId) {
    preferredPasskey = await db.passkey.findFirst({
      where: {
        userId,
        id: preferredPasskeyId,
      },
      select: {
        credentialId: true,
        transports: true,
      },
    });

    if (!preferredPasskey) {
      throw new Error("Requested passkey not found");
    }
  }

  const options = await generateAuthenticationOptions({
    rpID: rpId,
    userVerification: "preferred",
    timeout,
    allowCredentials: preferredPasskey
      ? [
          {
            id: preferredPasskey.credentialId.toString("utf8"),
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            transports:
              preferredPasskey.transports as AuthenticatorTransportFuture[],
          },
        ]
      : undefined,
  });

  const { secondaryId } = await db.verificationToken.create({
    data: {
      userId,
      token: options.challenge,
      expires: new Date(new Date().getTime() + 2 * 60000), // 2 min expiry
      identifier: "PASSKEY_CHALLENGE",
    },
  });

  return {
    tokenReference: secondaryId,
    options,
  };
};
