import { redirect } from "next/navigation";
import LoginForm from "@/components/onboarding/login";
import { getServerAuthSession } from "@/server/auth";

import type { Metadata } from "next";
import { IS_GOOGLE_AUTH_ENABLED } from "@/constants/auth";

export const metadata: Metadata = {
  title: "Login | OpenCap",
  description: "Login to OpenCap",
};

export default async function AuthPage() {
  const session = await getServerAuthSession();

  if (session?.user?.companyPublicId) {
    return redirect(`/${session.user.companyPublicId}`);
  }

  return <LoginForm isGoogleAuthEnabled={IS_GOOGLE_AUTH_ENABLED} />;
}
