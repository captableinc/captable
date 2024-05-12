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

interface ShareDataRoomEmailProps {
  senderName: string
  recipientName: string | null | undefined
  companyName: string
  dataRoom: string
  link: string
}

export const ShareDataRoomEmail = ({
  senderName,
  recipientName,
  companyName,
  dataRoom,
  link,
}: ShareDataRoomEmailProps) => {
  const recipientFirstName = recipientName?.split(' ')[0] || 'there'
  const previewText = `${senderName} at ${companyName} shared ${dataRoom} with you.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {companyName} - <strong>{dataRoom}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {recipientFirstName},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{senderName}</strong> has shared a data room{' '}
              <strong>{dataRoom}</strong> on <strong>{constants.title}</strong>
            </Text>

            <Section className="mb-[32px] mt-[32px]">
              <Button
                className="rounded bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Access {dataRoom}
              </Button>
            </Section>

            <Text className="!text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link
                href={link}
                className="break-all text-blue-600 no-underline"
              >
                {link}
              </Link>
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />
            <Link href={constants.url} className="text-sm no-underline">
              <span className="text-xs !text-gray-400">Powered by</span>
              <span>{` ${constants.title}`}</span>
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ShareDataRoomEmail.PreviewProps = {
  senderName: 'John Doe',
  recipientName: 'Will Smith',
  companyName: 'Captable, Inc.',
  dataRoom: 'Q1 2024 Financials',
  link: 'https://captable.inc/...',
} as ShareDataRoomEmailProps

export default ShareDataRoomEmail
