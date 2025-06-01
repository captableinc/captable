import { META } from "@captable/utils/constants";
import { Button, Footer, Heading, Layout, Link, Text } from "../components";

export interface MemberInviteEmailProps {
  invitedBy: string;
  companyName: string;
  inviteLink: string;
}

export const MemberInviteEmail = ({
  invitedBy,
  companyName,
  inviteLink,
}: MemberInviteEmailProps) => {
  const previewText = `Join ${invitedBy} on ${META.title}`;

  return (
    <Layout preview={previewText}>
      <Heading>
        Join <strong>{companyName}</strong> on <strong>{META.title}</strong>
      </Heading>

      <Text>Hello,</Text>

      <Text>
        <strong>{invitedBy}</strong> has invited you to join{" "}
        <strong>{companyName}</strong> on <strong>Captable, Inc.</strong>.
      </Text>

      <Button href={inviteLink}>Join the team</Button>

      <Text>
        or copy and paste this URL into your browser:{" "}
        <Link href={inviteLink} variant="breakable">
          {inviteLink}
        </Link>
      </Text>

      <Footer />
    </Layout>
  );
};

MemberInviteEmail.PreviewProps = {
  invitedBy: "joker",
  companyName: "Batmobile",
  inviteLink: "https://captable.inc/...",
} as MemberInviteEmailProps;

export default MemberInviteEmail;
