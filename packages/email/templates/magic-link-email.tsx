import { META } from "@captable/utils/constants";
import { Button, Footer, Heading, Layout, Link, Text } from "../components";

export interface MagicLinkEmailProps {
  magicLink: string;
}

export const MagicLinkEmail = ({ magicLink }: MagicLinkEmailProps) => (
  <Layout preview={`Your magic link for ${META.title}`}>
    <Heading>Your magic link for {META.title}</Heading>

    <Button href={magicLink}>Login</Button>

    <Text>
      or copy and paste this URL into your browser:{" "}
      <Link href={magicLink} variant="breakable">
        {magicLink}
      </Link>
    </Text>

    <Footer />
  </Layout>
);

MagicLinkEmail.PreviewProps = {
  magicLink: `${META.url}/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fonboarding&token=671d9eac4043bbe1c22aeafd419ddfe79c2282ec755c558ea789671fdaffe8dd&email=ceo%40example.com`,
} as MagicLinkEmailProps;

export default MagicLinkEmail;
