import { VerifyMemberForm } from "@/components/stakeholder/verify-member-form";
import { withServerSession } from "@/server/auth";
import { checkVerificationToken } from "@/server/stakeholder";

export default async function VerifyMember({
  params: { token },
}: {
  params: { token: string };
}) {
  const session = await withServerSession();

  const { membershipId } = await checkVerificationToken(
    token,
    session.user.email,
  );

  return <VerifyMemberForm membershipId={membershipId} token={token} />;
}
