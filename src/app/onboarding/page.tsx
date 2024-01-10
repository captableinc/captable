import OnboardingProvider from "@/components/onboarding/provider";

export default function Onboarding() {
  return (
    <OnboardingProvider
      title="Get started with OpenCap"
      subtitle="Enter your email below to create an account"
      disclaimer={true}
    >
      Auth form
    </OnboardingProvider>
  )
};
