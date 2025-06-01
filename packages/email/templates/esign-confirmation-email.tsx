import { Button, Footer, Heading, Layout, Text } from "../components";

export type EsignConfirmationEmailPayloadType = {
  fileUrl: string;
  documentName: string;
  senderName: string | null;
  senderEmail: string | null;
  company: {
    name: string;
    logo?: string | null;
  };
  recipient: { name?: string | null; email: string };
};

export type EsignConfirmationEmailProps = Omit<
  EsignConfirmationEmailPayloadType,
  "fileUrl"
>;

const ESignConfirmationEmail = ({
  documentName,
  recipient,
  senderName,
  company,
}: EsignConfirmationEmailProps) => {
  const previewText = `${senderName ?? ""} has sent you a confirmation email with completed signed document.`;

  return (
    <Layout
      preview={previewText}
      logoUrl={company?.logo || undefined}
      logoAlt={`${company?.name} Logo`}
    >
      <Heading className="mx-0 mb-[15px] mt-5 p-0 text-center text-[24px] font-normal text-black">
        {company?.name}
      </Heading>

      <Text>Hello {recipient?.name},</Text>

      <Text className="mt-5 text-[14px] leading-[24px] text-black">
        All parties have completed and signed the document -{" "}
        <strong>{documentName}</strong>. Please find the attached document.
      </Text>

      <Text className="mt-[20px] !text-[14px] leading-[24px] text-black">
        - {senderName}
      </Text>

      <Footer customText="Please ignore, if you were not expecting this email." />
    </Layout>
  );
};

ESignConfirmationEmail.PreviewProps = {
  documentName: "Document Name",
  recipient: { name: "Recipient Name", email: "" },
  senderName: "Sender Name",
  senderEmail: "sender@example.com",
  company: { name: "Company Name" },
};

export default ESignConfirmationEmail;
