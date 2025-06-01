import { getAuthenticatorOptions } from "@/lib/authenticator";
import { Audit } from "@/server/audit";
import type { PasskeyAudit } from "@/trpc/routers/passkey-router/schema";
import { and, db, eq, passkeys, verificationTokens } from "@captable/db";
import type { Passkey } from "@captable/db";
import { createId } from "@paralleldrive/cuid2";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type {
  AuthenticatorTransportFuture,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
import { nanoid } from "nanoid";

type CreatePasskeyAuthenticationOptions = {
  userId: string;
  /**
   * The ID of the passkey to request authentication for.
   *
   * If not set, we allow the browser client to handle choosing.
   */
  preferredPasskeyId?: string;
  auditMetaData: PasskeyAudit;
};

export const createPasskeyAuthenticationOptions = async ({
  userId,
  preferredPasskeyId,
  auditMetaData,
}: CreatePasskeyAuthenticationOptions): Promise<{
  tokenReference: string;
  options: PublicKeyCredentialRequestOptionsJSON;
}> => {
  const { rpId, timeout } = getAuthenticatorOptions();

  let preferredPasskey: Pick<
    Passkey,
    "transports" | "credentialId" | "name"
  > | null = null;

  if (preferredPasskeyId) {
    const [result] = await db
      .select({
        credentialId: passkeys.credentialId,
        transports: passkeys.transports,
        name: passkeys.name,
      })
      .from(passkeys)
      .where(
        and(eq(passkeys.userId, userId), eq(passkeys.id, preferredPasskeyId)),
      )
      .limit(1);

    preferredPasskey = result || null;

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
            id: preferredPasskey.credentialId.toString(),
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            transports:
              preferredPasskey.transports as AuthenticatorTransportFuture[],
          },
        ]
      : undefined,
  });

  const { requestIp, userAgent, companyId, userName } = auditMetaData;
  const passKeyName = preferredPasskey?.name;

  await db.transaction(async (tx) => {
    await Audit.create(
      {
        action: "passkey.updated",
        companyId,
        actor: { type: "user", id: userId },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "passkey", id: preferredPasskeyId }],
        summary: `${userName} created auth-options for Passkey with id ${passKeyName}`,
      },
      tx,
    );
  });

  const secondaryId = nanoid(32);
  const [_verificationToken] = await db
    .insert(verificationTokens)
    .values({
      id: createId(),
      secondaryId,
      identifier: "PASSKEY_CHALLENGE",
      token: options.challenge,
      expires: new Date(new Date().getTime() + 2 * 60000), // 2 min expiry
      userId,
    })
    .returning();

  return {
    tokenReference: secondaryId,
    options,
  };
};
