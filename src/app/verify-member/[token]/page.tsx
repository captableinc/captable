import { VerifyMemberForm } from "@/components/member/verify-member-form";
import { authOptions } from "@/server/auth";
import { checkVerificationToken } from "@/server/member";
import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify member",
};

export default async function VerifyMember({
  params: { token },
  searchParams,
}: {
  params: { token: string };
  searchParams: {
    passwordResetToken: string;
    email: string;
  };
}) {
  const session = await getServerSession(authOptions);

  const passwordResetToken = searchParams.passwordResetToken;
  const email = searchParams.email;

  const params = new URLSearchParams({
    email: email,
    verificationToken: token,
  });

  if (!session?.user || !session?.user.email) {
    redirect(`/set-password/${passwordResetToken}?${params.toString()}`);
  }

  // check if token is valid
  const { memberId } = await checkVerificationToken(token, session.user.email);

  return <VerifyMemberForm memberId={memberId} token={token} />;
}
