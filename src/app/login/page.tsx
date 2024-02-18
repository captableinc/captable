import { redirect } from "next/navigation";
import LoginForm from "@/components/onboarding/login";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenCap - Login",
  description: "Login to OpenCap",
};

export default async function AuthPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.companyPublicId) {
    return redirect(`/${session.user.companyPublicId}`);
  }

  return <LoginForm />;
}
