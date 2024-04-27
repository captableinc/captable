import { type Metadata } from "next";
import VerifyEmail from "@/components/onboarding/verify-email";

export const metadata: Metadata = {
  title: "Verify Email",
};

export type PageProps = {
  params: {
    token: string;
  };
};

export default async function VerifyEmailPage({
  params: { token },
}: PageProps) {
  return <VerifyEmail token={token} />;
}
