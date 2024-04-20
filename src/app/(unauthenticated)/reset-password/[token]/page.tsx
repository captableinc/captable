import { type Metadata } from "next";
import { ResetPasswordForm } from "@/components/onboarding/reset-password";

export const metadata: Metadata = {
  title: "Reset Password",
};

export type PageProps = {
  params: {
    token: string;
  };
};

export default async function ResetPasswordPage({
  params: { token },
}: PageProps) {
  return <ResetPasswordForm token={token} />;
}
