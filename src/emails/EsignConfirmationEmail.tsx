import { env } from "@/env";
import { type TConfirmationEmailPayload } from "@/jobs/esign-confirmation-email";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "jsx-email";

type Payload = Omit<TConfirmationEmailPayload, "fileUrl">;
export const ConfirmationEmailBody = ({
  documentName,
  recipient,
  senderName,
  company,
}: Payload) => {
  const BASE_URL = env.NEXTAUTH_URL;
  return (
    <Html>
      <Head />
      <Preview>
        {senderName} has sent you a confirmation email with completed signed
        document.
      </Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${BASE_URL}/placeholders/company.svg`}
                width="48"
                height="48"
                alt="company_logo"
                className="mx-auto my-0"
              />
            </Section>

            <Heading className="mx-0 mb-[15px] mt-5 p-0 text-center text-[24px] font-normal text-black">
              {company?.name}
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              Hello {recipient?.name} ,
            </Text>

            <Text className="mt-5 text-[14px] leading-[24px] text-black">
              All parties have completed and signed the document -{" "}
              <strong>{documentName}</strong>. Please find the attached
              document.
            </Text>

            <Text className="mt-[20px] !text-[14px] leading-[24px] text-black">
              - {senderName}
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />
            <Text className="mx-auto text-center text-[12px] leading-[24px] text-[#666666]">
              Please ignore, if you were not expecting this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
