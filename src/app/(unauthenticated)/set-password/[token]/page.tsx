import { SetPasswordForm } from "@/components/onboarding/set-password";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Set Password",
};

export type PageProps = {
  params: {
    token: string;
  };
  searchParams: {
    verificationToken: string;
    email: string;
  };
};

export default async function SetPasswordPage({
  params: { token },
  searchParams,
}: PageProps) {
  const verificationToken = searchParams.verificationToken;
  const email = searchParams.email;

  if (!verificationToken || !email) {
    redirect("/set-password");
  }

  return (
    <SetPasswordForm
      token={token}
      email={email}
      verificationToken={verificationToken}
    />
  );
}
