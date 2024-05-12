import { db } from "@/server/db";
import { type Prisma } from "@prisma/client";

export interface FindPasskeysOptions {
  userId: string;
}

export const findPasskeys = async ({ userId }: FindPasskeysOptions) => {
  const whereClause: Prisma.PasskeyWhereInput = {
    userId,
  };

  const data = await db.passkey.findMany({
    where: whereClause,
    select: {
      id: true,
      userId: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      lastUsedAt: true,
      counter: true,
      credentialDeviceType: true,
      credentialBackedUp: true,
      transports: true,
    },
  });

  return { data };
};
