import { render } from "jsx-email";
import { db } from "./db";
import { sendMail } from "./mailer";
import MemberInviteEmail from "@/emails/MemberInviteEmail";
import { constants } from "@/lib/constants";
import { nanoid } from "nanoid";
import { env } from "@/env";
import { createHash } from "@/lib/crypto";
import { type Prisma } from "@prisma/client";

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

  const [email, memberId] = invite.identifier.split(":");

  if (!memberId) {
    throw new Error("member id not found");
  }

  if (!email) {
    throw new Error("user email not found");
  }

  if (userEmail !== email) {
    throw new Error("invalid email");
  }

  return { memberId, email };
};

interface generateMemberIdentifierOptions {
  email: string;
  memberId: string;
}

export const generateMemberIdentifier = ({
  email,
  memberId,
}: generateMemberIdentifierOptions) => {
  return `${email}:${memberId}`;
};

interface sendMemberInviteEmailOptions {
  verificationToken: string;
  token: string;
  email: string;
  company: { name: string; id: string };
  user: { email: string | null | undefined; name: string | null | undefined };
}

export async function sendMemberInviteEmail({
  company,
  email,
  verificationToken,
  token,
  user,
}: sendMemberInviteEmailOptions) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const callbackUrl = `${baseUrl}/verify-member/${verificationToken}`;

  const params = new URLSearchParams({
    callbackUrl,
    token,
    email,
  });

  const inviteLink = `${baseUrl}/api/auth/callback/email?${params.toString()}`;

  await sendMail({
    to: email,
    subject: `Join ${company.name} on ${constants.title}`,
    html: await render(
      MemberInviteEmail({
        inviteLink,
        companyName: company.name,
        invitedBy: (user.name ?? user.email)!,
      }),
    ),
  });
}

export async function generateInviteToken() {
  const token = nanoid(32);

  const secret = env.NEXTAUTH_SECRET;

  const ONE_DAY_IN_SECONDS = 86400;
  const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

  const memberInviteTokenHash = await createHash(`member-${nanoid(16)}`);
  const authTokenHash = await createHash(`${token}${secret}`);

  return { token, expires, memberInviteTokenHash, authTokenHash };
}

interface revokeExistingInviteTokensOptions {
  memberId: string;
  email: string;
  tx?: Prisma.TransactionClient;
}

export async function revokeExistingInviteTokens({
  email,
  memberId,
  tx,
}: revokeExistingInviteTokensOptions) {
  const dbClient = tx ?? db;

  const identifier = generateMemberIdentifier({
    email,
    memberId,
  });

  const verificationToken = await dbClient.verificationToken.findMany({
    where: {
      identifier,
    },
  });
  await dbClient.verificationToken.deleteMany({
    where: {
      token: {
        in: verificationToken.map((item) => item.token),
      },
    },
  });
}
