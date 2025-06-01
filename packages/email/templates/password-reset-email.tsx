import { META } from "@captable/utils/constants";
import { Button, Footer, Heading, Layout, Link, Text } from "../components";

export interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail = ({ resetLink }: PasswordResetEmailProps) => (
  <Layout preview={`Your password reset link for ${META.title}`}>
    <Heading>Your password reset link for {META.title}</Heading>

    <Button href={resetLink}>Reset</Button>

    <Text>
      or copy and paste this URL into your browser:{" "}
      <Link href={resetLink} variant="breakable">
        {resetLink}
      </Link>
    </Text>

    <Footer />
  </Layout>
);

export default PasswordResetEmail;
