import { PASSKEY_TIMEOUT } from "@/constants/passkey";
import { getAuthenticatorOptions } from "@/lib/authenticator";
import { db } from "@/server/db";
import type { PasskeyAudit } from "@/trpc/routers/passkey-router/schema";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import { Audit } from "../audit";

type CreatePasskeyRegistrationOptions = {
  userId: string;
  auditMetaData: PasskeyAudit;
};

export const createPasskeyRegistrationOptions = async ({
  userId,
  auditMetaData,
}: CreatePasskeyRegistrationOptions) => {
  const user = await db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      passkeys: true,
    },
  });

  const { passkeys } = user;
  const { rpName, rpId: rpID } = getAuthenticatorOptions();
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: isoUint8Array.fromUTF8String(userId),
    userName: user.email ?? "",
    userDisplayName: user.name ?? undefined,
    timeout: PASSKEY_TIMEOUT,
    attestationType: "none",
    excludeCredentials: passkeys.map((passkey) => ({
      id: passkey.credentialId.toString("utf8"),
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      transports: passkey.transports as AuthenticatorTransportFuture[],
    })),
  });

  const { requestIp, userAgent, companyId } = auditMetaData;
  passkeys.map(async (passKey) => {
    await Audit.create(
      {
        action: "passkey.registrationOptions-created",
        companyId,
        actor: { type: "user", id: userId },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "passkey", id: passKey.id }],
        summary: `${user.name} created registration-options for the Passkey ${passKey.name}`,
      },
      db,
    );
  });

  await db.verificationToken.create({
    data: {
      userId,
      token: options.challenge,
      expires: new Date(new Date().getTime() + 2 * 60000), // 2 min expiry
      identifier: "PASSKEY_CHALLENGE",
    },
  });

  return options;
};
