import { constants } from "../lib/constants";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "jsx-email";

interface MemberInviteEmailProps {
  username: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

export const MemberInviteEmail = ({
  username,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: MemberInviteEmailProps) => {
  const previewText = `Join ${invitedByUsername} on ${constants.title}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] border-separate rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]"></Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{teamName}</strong> on{" "}
              <strong>{constants.title}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{teamName}</strong> team on{" "}
              <strong>OpenCap</strong>.
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="!text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

MemberInviteEmail.PreviewProps = {
  username: "batman",
  invitedByUsername: "joker",
  invitedByEmail: "joker@arkham.com",
  teamName: "Batmobile",
  inviteLink: "https://opencap.co/teams/invite/foo",
} as MemberInviteEmailProps;

export default MemberInviteEmail;
