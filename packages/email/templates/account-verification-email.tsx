import { META } from "@captable/utils/constants";
import { Button, Footer, Heading, Layout, Link, Text } from "../components";

export interface AccountVerificationEmailProps {
  verifyLink: string;
}

export const AccountVerificationEmail = ({
  verifyLink,
}: AccountVerificationEmailProps) => (
  <Layout preview={`Your email verification link for ${META.title}`}>
    <Heading>Your verification email link for {META.title}</Heading>

    <Button href={verifyLink}>Verify</Button>

    <Text>
      or copy and paste this URL into your browser:{" "}
      <Link href={verifyLink} variant="breakable">
        {verifyLink}
      </Link>
    </Text>

    <Footer />
  </Layout>
);

export default AccountVerificationEmail;
