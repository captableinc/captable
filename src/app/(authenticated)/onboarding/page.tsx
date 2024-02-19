import OnboardingCompany from "@/components/onboarding/company";
import { withServerSession } from "@/server/auth";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const session = await withServerSession();
  const user = session.user;
  console.log({
    user,
  });
  if (user.isOnboarded) {
    redirect("/dashboard");
  }

  return <OnboardingCompany currentUser={user} />;
};

export default OnboardingPage;
