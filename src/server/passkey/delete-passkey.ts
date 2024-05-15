import { db } from "@/server/db";

export interface DeletePasskeyOptions {
  userId: string;
  passkeyId: string;
}

export const deletePasskey = async ({
  userId,
  passkeyId,
}: DeletePasskeyOptions) => {
  await db.passkey.findFirstOrThrow({
    where: {
      id: passkeyId,
      userId,
    },
  });

  await db.$transaction(async (tx) => {
    await tx.passkey.delete({
      where: {
        id: passkeyId,
        userId,
      },
    });

    // @TODO (Audit)
  });
};
