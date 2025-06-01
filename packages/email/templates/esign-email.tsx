import { Button, Footer, Heading, Layout, Link, Text } from "../components";

export interface EsignEmailPayloadType {
  documentName?: string;
  message?: string | null;
  recipient: {
    id: string;
    name: string | null | undefined;
    email: string;
  };
  sender?: {
    name: string | null | undefined;
    email: string | null | undefined;
  };
  company?: {
    name: string;
    logo: string | null | undefined;
  };
}

export type EsignEmailProps = EsignEmailPayloadType & { signingLink: string };

const EsignEmail = ({
  signingLink,
  message,
  documentName,
  recipient,
  sender,
  company,
}: EsignEmailProps) => {
  const previewText = `${sender?.name ?? ""} has sent you a document to sign.`;

  return (
    <Layout
      preview={previewText}
      logoUrl={company?.logo || undefined}
      logoAlt={`${company?.name} Logo`}
    >
      <Heading className="mt-8px mx-0 mb-[15px] p-0 text-center text-[24px] font-normal text-black">
        <strong>{company?.name}</strong>
      </Heading>

      <Heading>
        <strong>{sender?.name}</strong> has sent you a document{" "}
        <strong>{`"${documentName}"`}</strong> to sign.
      </Heading>

      <Text>Hello {recipient?.name},</Text>

      {message ? (
        <Text>{message}</Text>
      ) : (
        <Text>
          <strong>{sender?.name}</strong> from <strong>{company?.name}</strong>{" "}
          has sent you <strong>{`"${documentName}"`}</strong>
        </Text>
      )}

      <Button href={signingLink} sectionClassName="mx-auto mb-[32px] mt-[32px]">
        Sign the document
      </Button>

      <Text>
        or copy and paste this URL into your browser:{" "}
        <Link href={signingLink} variant="breakable">
          {signingLink}
        </Link>
      </Text>

      <Footer customText="Please ignore, if you were not expecting this email." />
    </Layout>
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
} as EsignEmailProps;

export default EsignEmail;
