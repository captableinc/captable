import { getAuthenticatorOptions } from "@/lib/authenticator";
import { PASSKEY_TIMEOUT } from "@/lib/constants/passkey";
import { Audit } from "@/server/audit";
import type { PasskeyAudit } from "@/trpc/routers/passkey-router/schema";
import { db, eq, passkeyVerificationTokens, users } from "@captable/db";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";
import type {
  AuthenticatorTransportFuture,
  PublicKeyCredentialCreationOptionsJSON,
} from "@simplewebauthn/types";

type CreatePasskeyRegistrationOptions = {
  userId: string;
  auditMetaData: PasskeyAudit;
};

export const createPasskeyRegistrationOptions = async ({
  userId,
  auditMetaData,
}: CreatePasskeyRegistrationOptions): Promise<PublicKeyCredentialCreationOptionsJSON> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      passkeys: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

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
      id: passkey.credentialId.toString(),
      transports: passkey.transports as AuthenticatorTransportFuture[],
    })),
  });

  const { requestIp, userAgent, companyId } = auditMetaData;
  passkeys.map(async (passKey) => {
    await Audit.create(
      {
        action: "passkey.updated",
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

  await db.insert(passkeyVerificationTokens).values({
    id: userId,
    token: options.challenge,
    expiresAt: new Date(new Date().getTime() + 2 * 60000), // 2 min expiry
    createdAt: new Date(),
  });

  return options;
};
