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
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "jsx-email";
import {
  ArrowRight,
  SignatureIcon,
  UserAvatarIcon,
} from "../components/common/icons";

type TEsignEmailProps = TEmailPayload & { signingLink: string };

const EsignEmail = ({
  signingLink,
  message,
  documentName,
  recipient,
  sender,
  company,
}: TEsignEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{sender?.name} has sent you a document to sign.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
            <Heading className="mt-8px mx-0 mb-[15px] p-0 text-center text-[24px] font-normal text-black">
              <strong>{company?.name}</strong>
            </Heading>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <Text>
                <strong>{sender?.name}</strong> has sent you a document{" "}
                <strong>{`"${documentName}"`}</strong> to sign.
              </Text>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {recipient?.name},
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
                  <strong>{sender?.name}</strong> from{" "}
                  <strong>{company?.name}</strong> has sent you{" "}
                  <strong>{`"${documentName}"`}</strong>
                </Text>
              </>
            )}
            <Section className="max-w-[435px]">
              <Row className="gap-x-6">
                <Column align="right">
                  <UserAvatarIcon className="h-16 w-16 rounded-full" />
                </Column>
                <Column className="mx-24" align="center">
                  <ArrowRight className="mx-3 h-6 w-6" />
                </Column>
                <Column align="left">
                  <SignatureIcon className="text-blue-700" />
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

EsignEmail.PreviewProps = {
  signingLink: "https://example.com",
  // message: "This is a test message",
  documentName: "Test Document",
  recipient: {},
  sender: {
    name: "John Doe",
  },
  company: {},
} as TEsignEmailProps;

export default EsignEmail;
