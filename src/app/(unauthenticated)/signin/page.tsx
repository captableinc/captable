import SignInForm from "@/components/onboarding/signin";
import { IS_GOOGLE_AUTH_ENABLED } from "@/constants/auth";
import type { Metadata } from "next";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign In to Captable, Inc.",
};

export default async function SignIn() {
  const session = await getServerAuthSession();

  if (session?.user?.companyPublicId) {
    return redirect(`/${session.user.companyPublicId}`);
  }
  return <SignInForm isGoogleAuthEnabled={IS_GOOGLE_AUTH_ENABLED} />;
}
