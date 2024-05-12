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
  Tailwind,
  Text,
} from 'jsx-email'
import { constants } from '../lib/constants'

interface MemberInviteEmailProps {
  invitedBy: string
  companyName: string
  inviteLink: string
}

export const MemberInviteEmail = ({
  invitedBy,
  companyName,
  inviteLink,
}: MemberInviteEmailProps) => {
  const previewText = `Join ${invitedBy} on ${constants.title}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{companyName}</strong> on{' '}
              <strong>{constants.title}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello ,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedBy}</strong> has invited you to join{' '}
              <strong>{companyName}</strong> on <strong>Captable, Inc.</strong>.
            </Text>

            <Section className="mb-[32px] mt-[32px]">
              <Button
                className="rounded bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="!text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link
                href={inviteLink}
                className="break-all text-blue-600 no-underline"
              >
                {inviteLink}
              </Link>
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />
            <Link
              href={constants.url}
              className="text-sm !text-gray-400 no-underline"
            >
              {constants.title}
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

MemberInviteEmail.PreviewProps = {
  invitedBy: 'joker',
  companyName: 'Batmobile',
  inviteLink: 'https://captable.inc/...',
} as MemberInviteEmailProps

export default MemberInviteEmail
