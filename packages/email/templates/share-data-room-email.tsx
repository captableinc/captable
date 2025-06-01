import { META } from "@captable/utils/constants";
import { Button, Footer, Heading, Layout, Link, Text } from "../components";

export interface ShareDataRoomEmailProps {
  senderName: string;
  recipientName: string | null | undefined;
  companyName: string;
  dataRoom: string;
  link: string;
}

export const ShareDataRoomEmail = ({
  senderName,
  recipientName,
  companyName,
  dataRoom,
  link,
}: ShareDataRoomEmailProps) => {
  const recipientFirstName = recipientName?.split(" ")[0] || "there";
  const previewText = `${senderName} at ${companyName} shared ${dataRoom} with you.`;

  return (
    <Layout preview={previewText}>
      <Heading>
        {companyName} - <strong>{dataRoom}</strong>
      </Heading>

      <Text>Hello {recipientFirstName},</Text>

      <Text>
        <strong>{senderName}</strong> has shared a data room{" "}
        <strong>{dataRoom}</strong> on <strong>{META.title}</strong>
      </Text>

      <Button href={link}>Access {dataRoom}</Button>

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

ShareDataRoomEmail.PreviewProps = {
  senderName: "John Doe",
  recipientName: "Will Smith",
  companyName: "Captable, Inc.",
  dataRoom: "Q1 2024 Financials",
  link: "https://captable.inc/...",
} as ShareDataRoomEmailProps;

export default ShareDataRoomEmail;
