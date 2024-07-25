import type { getRoleById } from "@/lib/rbac/access-control";
import { generateInviteToken, generateMemberIdentifier } from "@/server/member";
import type { PrismaClient } from "@prisma/client";

export type PrismaTransactionalClient = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];

type MemberPayload = {
  userId: string;
  name: string;
  title: string;
  email: string;
  companyId: string;
  role: Awaited<ReturnType<typeof getRoleById>>;
};

export async function createMember(
  tx: PrismaTransactionalClient,
  memberPayload: MemberPayload,
) {
  const { userId, companyId, email, title, role } = memberPayload;
  //  create member
  const member = await tx.member.upsert({
    create: {
      title,
      isOnboarded: false,
      lastAccessed: new Date(),
      companyId,
      userId,
      status: "PENDING",
      ...role,
    },
    update: {
      title,
      isOnboarded: false,
      lastAccessed: new Date(),
      status: "PENDING",
      ...role,
    },
    where: {
      companyId_userId: {
        companyId,
        userId,
      },
    },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const { expires, memberInviteTokenHash } = await generateInviteToken();

  // custom verification token for member invitation
  const { token: verificationToken } = await tx.verificationToken.create({
    data: {
      identifier: generateMemberIdentifier({
        email,
        memberId: member.id,
      }),
      token: memberInviteTokenHash,
      expires,
    },
  });

  return {
    verificationToken,
    member,
  };
}
