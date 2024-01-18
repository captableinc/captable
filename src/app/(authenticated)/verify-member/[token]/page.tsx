import { VerifyMemberForm } from "@/components/stakeholder/verify-member-form";
import { withServerSession } from "@/server/auth";
import { handleVerificationToken } from "@/server/stakeholder";

export default async function VerifyMember({
  params: { token },
}: {
  params: { token: string };
}) {
  const session = await withServerSession();

  const { membershipId } = await handleVerificationToken(
    token,
    session.user.email,
  );

  return <VerifyMemberForm membershipId={membershipId} />;
}
