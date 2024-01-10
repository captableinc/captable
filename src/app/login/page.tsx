import { Button } from "@/components/ui/button";
import Layout from "../onboarding/layout";
import OnboardingProvider from "@/components/onboarding/provider";

export default function AuthPage() {
  return (
    <Layout>
      <OnboardingProvider
        title="Login to OpenCap"
        subtitle="Enter your email to login with a magic link"
      >
        Auth form
      </OnboardingProvider>
    </Layout>
  )
};
