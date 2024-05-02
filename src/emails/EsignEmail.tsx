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

export interface EsignEmailProps {
  signingLink: string;
  optionalMessage?: string;
  documentName?: string;
  recipient?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  sender?: {
    id: string;
    name: string;
    email: string;
  };
  company?: {
    name: string;
    logo: string;
  };
  expiryDate?: string;
}

export const EsignEmail = ({
  signingLink,
  optionalMessage,
  documentName,
  recipient,
  sender,
  company,
  expiryDate,
}: EsignEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{sender?.name} has sent you a document to sign.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={company?.logo}
                width="45"
                height="45"
                alt="Vercel"
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
            {optionalMessage ? (
              <>
                <Text className="text-[14px] leading-[24px] text-black">
                  {optionalMessage}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-[14px] leading-[24px] text-black">
                  {sender?.name} from <strong>{company?.name}</strong> has sent
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  you "{documentName?.replaceAll("_", " ").toLocaleUpperCase()}"
                </Text>
              </>
            )}
            {expiryDate && (
              <Text className="mt-[4px] text-[14px] leading-[24px] text-black">
                Please note that this document needs to be signed by{" "}
                {expiryDate}
              </Text>
            )}
            <Section className="max-w-[435px]">
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={
                      "https://www.svgrepo.com/show/452030/avatar-default.svg"
                    }
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <Img
                    src={`https://jsx.email/assets/demo/vercel-arrow.png`}
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={"https://www.svgrepo.com/show/437226/signature.svg"}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>

            <Section className="mx-auto mb-[32px] mt-[32px]">
              <Button
                className="mx-[200px] rounded bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={signingLink}
              >
                Esign the template
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
              If you were not expecting this email, you can ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
