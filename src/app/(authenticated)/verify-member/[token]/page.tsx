import { VerifyMemberForm } from "@/components/stakeholder/verify-member-form";
import { withServerSession } from "@/server/auth";
import { db } from "@/server/db";

export default async function VerifyMember({
  params: { token },
}: {
  params: { token: string };
}) {
  const session = await withServerSession();

  const verificationToken = await db.verificationToken.findFirst({
    where: {
      token,
    },
  });

  if (!verificationToken) {
    throw new Error("invalid token");
  }

  const [userEmail, membershipId] = verificationToken.identifier.split(":");

  if (!membershipId) {
    throw new Error("membership id not found");
  }

  if (!userEmail) {
    throw new Error("user email not found");
  }

  if (session.user.email !== userEmail) {
    throw new Error("invalid email");
  }

  return <VerifyMemberForm membershipId={membershipId} />;
}
