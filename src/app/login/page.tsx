import { redirect } from "next/navigation";
import LoginForm from "@/components/onboarding/login";
import { withServerSession } from "@/server/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenCap - Login",
  description: "Login to OpenCap",
};

export default async function AuthPage() {
  const session = await withServerSession();

  if (session.user && session.user.companyPublicId) {
    return redirect(`/${session.user.companyPublicId}`);
  }

  return <LoginForm />;
}
