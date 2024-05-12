import { db } from "@/server/db";

export interface UpdateAuthenticatorsOptions {
  userId: string;
  passkeyId: string;
  name: string;
}

export const updatePasskey = async ({
  userId,
  passkeyId,
  name,
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

    //@TODO(Audit)
  });
};
