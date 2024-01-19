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

export const checkVerificationToken = async (
  token: string,
  userEmail: string | null | undefined,
) => {
  // based on https://github.com/nextauthjs/next-auth/blob/46264fb42af4c3ef7137a5694875eaa1309462ea/packages/core/src/lib/actions/callback/index.ts#L200
  const invite = await db.verificationToken.findFirst({
    where: {
      token,
    },
  });
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

interface generateMembershipIdentifierOptions {
  email: string;
  membershipId: string;
}

export const generateMembershipIdentifier = ({
  email,
  membershipId,
}: generateMembershipIdentifierOptions) => {
  return `${email}:${membershipId}`;
};
