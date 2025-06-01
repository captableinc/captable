import SignUpForm from "@/components/onboarding/signup";
import { IS_GOOGLE_AUTH_ENABLED } from "@/lib/constants/auth";
import { serverSideSession } from "@captable/auth/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign Up to Captable, Inc.",
};

export default async function SignIn() {
  try {
    const session = await serverSideSession({ headers: await headers() });

    if (session?.user) {
      if (session?.user?.companyPublicId) {
        return redirect(`/${session.user.companyPublicId}`);
      }
      return redirect("/onboarding");
    }
  } catch (_error) {
    // No session, continue to signup page
  }

  return <SignUpForm isGoogleAuthEnabled={IS_GOOGLE_AUTH_ENABLED} />;
}
