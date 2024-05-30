import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "jsx-email";

interface GoogleAccountDisconnectEmailProps {
  email: string;
  companyName: string;
  recipientName: string;
}

export const GoogleAccountDisconnectEmail = ({
  email,
  companyName,
  recipientName,
}: GoogleAccountDisconnectEmailProps) => {
  const previewText = "Unlinked your google account";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Google account unlinked from your account</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello , {recipientName}
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We wanted to inform you that your Google account {email} has been
              successfully disconnected from your {companyName} account. You
              will no longer be able to sign in to {companyName} using your
              Google credentials.
            </Text>

            <Text className="!text-[14px] leading-[24px] text-black">
              Thank you,
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />
            <Text className="text-sm !text-gray-400 no-underline">
              {companyName}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

GoogleAccountDisconnectEmail.PreviewProps = {
  email: "company@example.com",
  companyName: "Company Name",
  recipientName: "Recipient Name",
} as GoogleAccountDisconnectEmailProps;

export default GoogleAccountDisconnectEmail;
