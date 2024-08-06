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

interface TwoFactorAuthRecoveryCodesEmailProps {
  recoveryCodes: string[];
}

export const TwoFactorAuthRecoveryCodesEmail = ({
  recoveryCodes,
}: TwoFactorAuthRecoveryCodesEmailProps) => (
  <Html>
    <Head />
    <Preview>Your two factor auth recovery codes:</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
          <Heading className="mx-0 my-[30px] p-0  text-[24px] font-normal text-black">
            Your two factor authentication recovery codes:
          </Heading>
          <Section className="mb-[3px] flex flex-wrap px-4 mt-[10px] ">
            {recoveryCodes.map((code) => (
              <Text key={code} className="text-gray-700 font-semibold">
                {code}
              </Text>
            ))}
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
export default TwoFactorAuthRecoveryCodesEmail;
