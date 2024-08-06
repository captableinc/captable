import {
  Body,
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

interface UserAccountBlockedEmailProps {
  userName: string;
  companyName: string;
}

export const UserAccountBlockedEmail = ({
  userName,
  companyName,
}: UserAccountBlockedEmailProps) => (
  <Html>
    <Head />
    <Preview>User account blocked for {companyName}</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
          <Heading className="mx-0 my-[30px] p-0  text-[24px] font-normal text-black">
            User account blocked for {companyName}
          </Heading>
          <Section>
            <Section className="mb-[5px] mt-[10px] ">
              <Text>Dear {userName},</Text>
              <Text>We hope this message finds you well!</Text>
              <Text className="!text-[14px] leading-[24px] text-black">
                Your user account for {companyName} has been temporarily blocked
                due to excessive login attempts. Please contact to the support
                team for the help.
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

UserAccountBlockedEmail.PreviewProps = {
  userName: "John doe",
  companyName: "XYZ company",
} as UserAccountBlockedEmailProps;

export default UserAccountBlockedEmail;
