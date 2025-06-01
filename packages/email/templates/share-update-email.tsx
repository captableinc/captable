import { META } from "@captable/utils/constants";
import { Button, Footer, Heading, Layout, Link, Text } from "../components";

export interface ShareUpdateEmailProps {
  senderName: string;
  recipientName: string | null | undefined;
  companyName: string;
  updateTitle: string;
  link: string;
}

export const ShareUpdateEmail = ({
  senderName,
  recipientName,
  companyName,
  updateTitle,
  link,
}: ShareUpdateEmailProps) => {
  const recipientFirstName = recipientName?.split(" ")[0] || "there";
  const previewText = `${senderName} at ${companyName} shared ${updateTitle} with you.`;

  return (
    <Layout preview={previewText}>
      <Heading>
        {companyName} - <strong>{updateTitle}</strong>
      </Heading>

      <Text>Hello {recipientFirstName},</Text>

      <Text>
        <strong>{senderName}</strong> has shared an update{" "}
        <strong>{updateTitle}</strong> on <strong>{META.title}</strong>
      </Text>

      <Button href={link}>
        View update - <strong>{updateTitle}</strong>
      </Button>

      <Text>
        or copy and paste this URL into your browser:{" "}
        <Link href={link} variant="breakable">
          {link}
        </Link>
      </Text>

      <Footer showDivider={true} />

      <Link href={META.url} className="text-sm no-underline">
        <span className="text-xs !text-muted-foreground">Powered by</span>
        <span>{` ${META.title}`}</span>
      </Link>
    </Layout>
  );
};

ShareUpdateEmail.PreviewProps = {
  senderName: "John Doe",
  recipientName: "Will Smith",
  companyName: "Captable, Inc.",
  updateTitle: "Q1 2024 Financials",
  link: "https://captable.inc/...",
} as ShareUpdateEmailProps;

export default ShareUpdateEmail;
