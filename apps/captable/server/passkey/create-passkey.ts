import { getAuthenticatorOptions } from "@/lib/authenticator";
import { MAXIMUM_PASSKEYS } from "@/lib/constants/passkey";
import { Audit } from "@/server/audit";
import type { PasskeyAudit } from "@/trpc/routers/passkey-router/schema";
import {
  type Passkey,
  count,
  db,
  desc,
  eq,
  passkeyVerificationTokens,
  passkeys,
} from "@captable/db";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/types";

type CreatePasskeyOptions = {
  userId: string;
  passkeyName: string;
  verificationResponse: RegistrationResponseJSON;
  auditMetaData: PasskeyAudit;
};

export const createPasskey = async ({
  userId,
  passkeyName,
  verificationResponse,
  auditMetaData,
}: CreatePasskeyOptions) => {
  const passKey = await db
    .select({ name: passkeys.name, count: count() })
    .from(passkeys)
    .where(eq(passkeys.userId, userId));

  if (passKey.length >= MAXIMUM_PASSKEYS) {
    throw new Error("TOO_MANY_PASSKEYS");
  }

  const verificationToken = await db.query.passkeyVerificationTokens.findFirst({
    orderBy: desc(passkeyVerificationTokens.createdAt),
    where: eq(passkeyVerificationTokens.id, userId),
  });

  if (!verificationToken) {
    throw new Error("Challenge token not found");
  }

  await db
    .delete(passkeyVerificationTokens)
    .where(eq(passkeyVerificationTokens.id, verificationToken.id));

  if (verificationToken.expiresAt < new Date()) {
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

  await db.transaction(async (tx) => {
    // Generate a random ID for the passkey
    const passkeyId = crypto.randomUUID();

    const passkeyRecords = await tx
      .insert(passkeys)
      .values({
        id: passkeyId,
        userId: userId,
        name: passkeyName,
        credentialId: Buffer.from(credentialID).toString("base64"),
        credentialPublicKey:
          Buffer.from(credentialPublicKey).toString("base64"),
        counter,
        credentialDeviceType:
          credentialDeviceType === "singleDevice"
            ? "SINGLE_DEVICE"
            : "MULTI_DEVICE",
        credentialBackedUp,
        transports: verificationResponse.response.transports || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const passkey = passkeyRecords[0] as Passkey;

    const { requestIp, userAgent, companyId } = auditMetaData;

    await Audit.create(
      {
        action: "passkey.created",
        companyId,
        actor: { type: "user", id: userId },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "passkey", id: passkey.id }],
        summary: `${name} created the Passkey ${passkey.name}`,
      },
      tx,
    );
  });
};
