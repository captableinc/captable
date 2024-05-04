import { ArrowRight, SignatureIcon } from "@/components/common/icons";
import { env } from "@/env";
import type { TEmailPayload } from "@/jobs/esign-email";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "jsx-email";

type TEsignEmailProps = TEmailPayload & { signingLink: string };

const EsignEmail = ({
  signingLink,
  message,
  documentName,
  recipient,
  sender,
  company,
}: TEsignEmailProps) => {
  const BASE_URL = env.NEXTAUTH_URL;
  return (
    <Html>
      <Head />
      <Preview>{sender?.name} has sent you a document to sign.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={company?.logo || `${BASE_URL}/placeholders/company.svg`}
                width="72"
                height="72"
                alt="company_logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mt-8px mx-0 mb-[15px] p-0 text-center text-[24px] font-normal text-black">
              <strong>{company?.name}</strong>
            </Heading>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <Text>
                Subject : {sender?.name} has sent you a document to sign.
              </Text>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {recipient?.name} ,
            </Text>
            {message ? (
              <>
                <Text className="text-[14px] leading-[24px] text-black">
                  {message}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-[14px] leading-[24px] text-black">
                  {sender?.name} from <strong>{company?.name}</strong> has sent
                  {/* eslint-disable-next-line react/no-unescaped-entities */}{" "}
                  you "{documentName?.replaceAll("_", " ").toLocaleUpperCase()}
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  ."
                </Text>
              </>
            )}
            <Section className="max-w-[435px]">
              <Row className="gap-x-6">
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={`${BASE_URL}/placeholders/user.svg`}
                    width="80px"
                    height="80px"
                    alt={"user_svg"}
                  />
                </Column>
                <Column className="mx-24" align="center">
                  <ArrowRight />
                </Column>
                <Column align="left">
                  <SignatureIcon />
                </Column>
              </Row>
            </Section>

            <Section className="mx-auto mb-[32px] mt-[32px]">
              <Button
                className="mx-[200px] rounded bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={signingLink}
              >
                Sign the document
              </Button>
            </Section>
            <Text className="!text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={signingLink}
                className="break-all text-blue-600 no-underline"
              >
                {signingLink}
              </Link>
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

export default EsignEmail;
