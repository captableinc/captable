import OnboardingCompany from "@/components/onboarding/company";
import { withServerSession } from "@/server/auth";

const OnboardingPage = async () => {
  const session = await withServerSession();
  const user = session.user;

  return <OnboardingCompany currentUser={user} />;
};

export default OnboardingPage;
