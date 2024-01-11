import OnboardingCompany from "@/components/onboarding/company";
import { getRequiredServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const session = await getRequiredServerAuthSession();

  if (session.user.isOnboarded) {
    redirect("/");
  }
  return <OnboardingCompany />;
};

export default OnboardingPage;
