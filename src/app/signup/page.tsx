import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignupForm from "@/components/onboarding/signup";
import { authOptions } from "@/server/auth";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenCap - Sign Up",
  description: "Create an account with OpenCap",
};

export default async function Onboarding() {
  const session = await getServerSession(authOptions);

  if (session?.user?.companyPublicId) {
    return redirect(`/${session.user.companyPublicId}`);
  }
  return <SignupForm />;
}
