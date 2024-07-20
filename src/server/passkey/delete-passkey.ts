import { db } from "@/server/db";
import type { PasskeyAudit } from "@/trpc/routers/passkey-router/schema";
import { Audit } from "../audit";

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
  const passkey = await db.passkey.findFirstOrThrow({
    where: {
      id: passkeyId,
      userId,
    },
  });

  const { requestIp, userAgent, companyId, userName } = auditMetaData;

  await db.$transaction(async (tx) => {
    await tx.passkey.delete({
      where: {
        id: passkeyId,
        userId,
      },
    });

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
      db,
    );
  });
};
