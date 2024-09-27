import { env } from "@/env";
import { constants } from "@/lib/constants";
import {
  Button,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { BaseLayout } from "./components/base-layout";

interface SafeSigningEmailProps {
  name: string;
  companyName: string;
  type: string;
  investmentAmount: string;
  token: string;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export function SafeSigningEmail({
  name = "John doe",
  companyName = "Acme inc",
  type = "post money",
  investmentAmount = "$100,000",
  token = "23343dsdsdsd233d",
}: SafeSigningEmailProps) {
  const link = `${baseUrl}/safe/${token}`;
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview> has sent you a document to sign.</Preview>
        <BaseLayout baseUrl={baseUrl}>
          <span className="font-medium">Hi {name},</span>
          <Text className="text-[#121212]">
            Welcome to {companyName} latest round of fundraising! To finalize
            your investment and update our cap table, please sign your{" "}
            <b>SAFE</b> using <b>{constants.title}</b>.
          </Text>

          <Section>
            <Text className="text-[#121212] font-semibold">
              Investment Summary:
            </Text>
            <ul>
              <li className="text-[12px]">
                <Text className="text-[12px] m-0">Company: {companyName}</Text>
              </li>
              <li className="text-[12px]">
                <Text className="text-[12px] m-0">
                  Investment Amount: {investmentAmount}
                </Text>
              </li>
              <li className="text-[12px]">
                <Text className="text-[12px] m-0">
                  SAFE Agreement Type: {type}
                </Text>
              </li>
            </ul>
          </Section>

          <Section>
            <Text className="text-[#121212] font-semibold">
              How to Sign Your SAFE:
            </Text>

            <ol>
              <li className="text-[12px]">
                <Text className="text-[12px] m-0">
                  <b>Click Sign SAFE Agreement</b> to securely access your
                  personalized SAFE agreement
                </Text>
              </li>
              <li className="text-[12px]">
                <Text className="text-[12px] m-0">
                  <b>Review the details</b> of the SAFE agreement, including
                  investment terms and future equity.
                </Text>
              </li>
              <li className="text-[12px]">
                <Text className="text-[12px] m-0">
                  <b>Confirm and sign</b> the agreement within the platform.
                </Text>
              </li>
              <li className="text-[12px]">
                <Text className="text-[12px] m-0">
                  You will receive a confirmation email, and your details will
                  be automatically updated in our cap table through{" "}
                  <b>{constants.title}</b>
                </Text>
              </li>
            </ol>
          </Section>

          <Section className="text-center mt-[32px] mb-[32px]">
            <Button
              className="rounded bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
              href={link}
            >
              Sign SAFE Agreement
            </Button>
          </Section>

          <Section>
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This email is intended for <b>{name}</b>. If you are not the
              intended recipient, please contact us immediately.
            </Text>
          </Section>
        </BaseLayout>
      </Tailwind>
    </Html>
  );
}

export default SafeSigningEmail;
