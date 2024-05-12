import { MAXIMUM_PASSKEYS } from "@/constants/passkey";
import { getAuthenticatorOptions } from "@/lib/authenticator";
import { CredentialDeviceTypeEnum } from "@/prisma/enums";
import { db } from "@/server/db";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/types";

type CreatePasskeyOptions = {
  userId: string;
  passkeyName: string;
  verificationResponse: RegistrationResponseJSON;
};

export const createPasskey = async ({
  userId,
  passkeyName,
  verificationResponse,
}: CreatePasskeyOptions) => {
  const { _count } = await db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          passkeys: true,
        },
      },
    },
  });

  if (_count.passkeys >= MAXIMUM_PASSKEYS) {
    throw new Error("TOO_MANY_PASSKEYS");
  }

  const verificationToken = await db.verificationToken.findFirst({
    where: {
      userId,
      identifier: "PASSKEY_CHALLENGE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!verificationToken) {
    throw new Error("Challenge token not found");
  }

  await db.verificationToken.deleteMany({
    where: {
      userId,
      identifier: "PASSKEY_CHALLENGE",
    },
  });

  if (verificationToken.expires < new Date()) {
    throw new Error("Challenge token expired");
  }

  const { rpId: expectedRPID, origin: expectedOrigin } =
    getAuthenticatorOptions();

  const verification = await verifyRegistrationResponse({
    response: verificationResponse,
    expectedChallenge: verificationToken.token,
    expectedOrigin,
    expectedRPID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error("Verification failed");
  }

  const {
    credentialPublicKey,
    credentialID,
    counter,
    credentialDeviceType,
    credentialBackedUp,
  } = verification.registrationInfo;

  await db.$transaction(async (tx) => {
    await tx.passkey.create({
      data: {
        userId,
        name: passkeyName,
        credentialId: Buffer.from(credentialID),
        credentialPublicKey: Buffer.from(credentialPublicKey),
        counter,
        credentialDeviceType:
          credentialDeviceType === "singleDevice"
            ? CredentialDeviceTypeEnum.SINGLE_DEVICE
            : CredentialDeviceTypeEnum.MULTI_DEVICE,
        credentialBackedUp,
        transports: verificationResponse.response.transports,
      },
    });

    //@TODO ( Have audit for passkey.create event)
  });
};
