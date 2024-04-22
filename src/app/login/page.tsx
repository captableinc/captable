import LoginForm from "@/components/onboarding/login";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

import { IS_GOOGLE_AUTH_ENABLED } from "@/constants/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Captable, Inc.",
  description: "Login to Captable, Inc.",
};

export default async function AuthPage() {
  const session = await getServerAuthSession();

  if (session?.user?.companyPublicId) {
    return redirect(`/${session.user.companyPublicId}`);
  }

  return <LoginForm isGoogleAuthEnabled={IS_GOOGLE_AUTH_ENABLED} />;
}
