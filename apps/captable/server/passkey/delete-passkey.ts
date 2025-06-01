import { Audit } from "@/server/audit";
import type { PasskeyAudit } from "@/trpc/routers/passkey-router/schema";
import { and, db, eq, passkeys } from "@captable/db";

export interface DeletePasskeyOptions {
  userId: string;
  passkeyId: string;
  auditMetaData: PasskeyAudit;
}

export const deletePasskey = async ({
  userId,
  passkeyId,
  auditMetaData,
}: DeletePasskeyOptions) => {
  const passkey = await db.query.passkeys.findFirst({
    where: and(eq(passkeys.id, passkeyId), eq(passkeys.userId, userId)),
    with: {
      user: true,
    },
  });

  if (!passkey) {
    throw new Error("Passkey not found");
  }

  const { requestIp, userAgent, companyId, userName } = auditMetaData;

  await db.transaction(async (tx) => {
    await tx.delete(passkeys).where(eq(passkeys.id, passkeyId));

    await Audit.create(
      {
        action: "passkey.deleted",
        companyId,
        actor: { type: "user", id: userId },
        context: {
          userAgent,
          requestIp,
        },
        target: [{ type: "passkey", id: passkey.id }],
        summary: `${userName} deleted the Passkey ${passkey.name}`,
      },
      tx,
    );
  });
};
