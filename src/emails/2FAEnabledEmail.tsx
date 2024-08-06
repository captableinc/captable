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
} from "jsx-email";
import * as React from "react";
import { constants } from "../lib/constants";

interface TwoFAEnabledEmailProps {
  userName: string;
  companyName: string;
}

export const TwoFAEnabledEmail = ({
  userName,
  companyName,
}: TwoFAEnabledEmailProps) => (
  <Html>
    <Head />
    <Preview>Two factor authentication enabled</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
          <Heading className="mx-0 my-[30px] p-0  text-[24px] font-normal text-black">
            Two factor authentication enabled
          </Heading>
          <Section>
            <Section className="mb-[5px] mt-[10px] ">
              <Text>Dear {userName},</Text>
              <Text>We hope this message finds you well!</Text>
              <Text className="!text-[14px] leading-[24px] text-black">
                We’re thrilled to inform you that two-factor authentication
                (2FA) has been successfully enabled for your account. Your
                security is our top priority, and this additional layer of
                protection ensures that your personal information and account
                details are more secure than ever.
              </Text>
            </Section>
          </Section>

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
);

TwoFAEnabledEmail.PreviewProps = {
  userName: "John doe",
  companyName: "XYZ company",
} as TwoFAEnabledEmailProps;

export default TwoFAEnabledEmail;
