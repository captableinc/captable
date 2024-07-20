import { db } from "@/server/db";
import type { PasskeyAudit } from "@/trpc/routers/passkey-router/schema";
import { Audit } from "../audit";

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
  const passkey = await db.passkey.findFirstOrThrow({
    where: {
      id: passkeyId,
      userId,
    },
  });

  if (passkey.name === name) {
    return;
  }

  const { requestIp, userAgent, companyId, userName } = auditMetaData;

  await db.$transaction(async (tx) => {
    await tx.passkey.update({
      where: {
        id: passkeyId,
        userId,
      },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

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
      db,
    );
  });
};
