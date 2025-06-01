import { Audit } from "@/server/audit";
import type { PasskeyAudit } from "@/trpc/routers/passkey-router/schema";
import { db, eq, passkeys } from "@captable/db";

export interface UpdateAuthenticatorsOptions {
  userId: string;
  passkeyId: string;
  name: string;
  auditMetaData: PasskeyAudit;
}

export const updatePasskey = async ({
  userId,
  passkeyId,
  name,
  auditMetaData,
}: UpdateAuthenticatorsOptions) => {
  const passkey = await db.query.passkeys.findFirst({
    where: eq(passkeys.id, passkeyId),
    with: {
      user: true,
    },
  });

  if (!passkey) {
    throw new Error("Passkey not found");
  }

  if (passkey.name === name) {
    return;
  }

  const { requestIp, userAgent, companyId, userName } = auditMetaData;

  await db.transaction(async (tx) => {
    await tx
      .update(passkeys)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(passkeys.id, passkeyId));

    await Audit.create(
      {
        action: "passkey.updated",
        companyId,
        actor: { type: "user", id: userId },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "passkey", id: passkey.id }],
        summary: `${userName} updated the Passkey ${passkey.name}`,
      },
      tx,
    );
  });
};
