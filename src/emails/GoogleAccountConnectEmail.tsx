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

interface GoogleAccountConnectEmailProps {
  email: string;
  companyName: string;
  recipientName: string;
}

export const GoogleAccountConnectEmail = ({
  email,
  companyName,
  recipientName,
}: GoogleAccountConnectEmailProps) => {
  const previewText = "Unlinked your google account";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Google account linked to your account</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello , {recipientName}
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We're excited to let you know that your google account {email} has
              been successfully connected to your {companyName} account. This
              integration will make it easier for you to access our services in
              a seamless and secure manner with google Oauth.
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

GoogleAccountConnectEmail.PreviewProps = {
  email: "company@example.com",
  companyName: "Company Name",
  recipientName: "Recipient Name",
} as GoogleAccountConnectEmailProps;

export default GoogleAccountConnectEmail;
