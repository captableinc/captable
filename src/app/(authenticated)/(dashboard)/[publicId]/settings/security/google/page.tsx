import { SecurityHeader } from "@/components/security/SecurityHeader";
import ConnectGoogleAccountModal from "@/components/security/google-account/connect-google-modal";
import DisconnectGoogleAccountAlertDialog from "@/components/security/google-account/disconnect-google-alert-dialog";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

const getMemberEmail = async (memberId: string) => {
  const member = await db.member.findUnique({
    where: {
      id: memberId,
    },
    select: {
      linkedEmail: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  return {
    googleLinkedEmail: member?.linkedEmail,
    memberLogInEmail: member?.user?.email,
  };
};

export default async function GoogleAccountManagerPage() {
  const session = await getServerAuthSession();
  if (!session) return;
  const { googleLinkedEmail, memberLogInEmail } = await getMemberEmail(
    session.user.memberId,
  );
  if (!memberLogInEmail) return;
  const isGoogleAlreadyLinked = !!googleLinkedEmail;
  return (
    <div className="flex flex-row items-center justify-between gap-y-3">
      <SecurityHeader
        title="Manage Oauth"
        subtitle="Connect / disconnect your google account"
        companyPublicId={session.user.companyPublicId}
      />
      <div className="flex items-center space-x-4">
        <ConnectGoogleAccountModal
          title="Connect google"
          subtitle={"By proceeding, you can login with ease."}
          trigger={
            <Button disabled={isGoogleAlreadyLinked}>Connect Google</Button>
          }
          loggedInEmail={memberLogInEmail}
        />
        <DisconnectGoogleAccountAlertDialog disabled={!isGoogleAlreadyLinked} />
      </div>
    </div>
  );
}
