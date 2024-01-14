import OnboardingCompany from "@/components/onboarding/company";
import { withServerSession } from "@/server/auth";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const session = await withServerSession();
  if (session.user.isOnboarded) {
    redirect("/dashboard");
  }

  return <OnboardingCompany />;
};

export default OnboardingPage;
