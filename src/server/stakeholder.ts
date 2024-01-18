import { type Prisma } from "@prisma/client";
import { db } from "./db";

export const getMembers = (companyId: string) => {
  return db.membership.findMany({
    where: {
      companyId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};

export type TypeGetMembers = Awaited<ReturnType<typeof getMembers>>;

// credits https://github.com/nextauthjs/next-auth/blob/46264fb42af4c3ef7137a5694875eaa1309462ea/packages/adapter-prisma/src/index.ts

export const deleteVerificationToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.delete({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch (error) {
    // If token already used/deleted, just return null
    // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025")
      return null;
    throw error;
  }
};

export const handleVerificationToken = async (
  token: string,
  userEmail: string | null | undefined,
) => {
  // based on https://github.com/nextauthjs/next-auth/blob/46264fb42af4c3ef7137a5694875eaa1309462ea/packages/core/src/lib/actions/callback/index.ts#L200
  const invite = await deleteVerificationToken(token);
  const hasInvite = !!invite;
  const expired = invite ? invite.expires.valueOf() < Date.now() : undefined;
  const invalidInvite = !hasInvite || expired;

  if (invalidInvite) {
    throw new Error("invalid invite or invite expired");
  }

  const [email, membershipId] = invite.identifier.split(":");

  if (!membershipId) {
    throw new Error("membership id not found");
  }

  if (!email) {
    throw new Error("user email not found");
  }

  if (userEmail !== email) {
    throw new Error("invalid email");
  }

  return { membershipId, email };
};
