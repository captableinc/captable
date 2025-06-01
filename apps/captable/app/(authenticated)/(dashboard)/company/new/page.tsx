import { CompanyForm } from "@/components/onboarding/company-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New",
};

const OnboardingPage = () => {
  return (
    <div className="flex min-h-screen justify-center bg-background px-5 pb-5 pt-20">
      <div className="border-rounded w-full max-w-2xl border bg-card p-10 shadow">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Captable, Inc.!
          </h1>
          <p className="text-sm text-muted-foreground">
            You are almost there. Please complete the form below to continue
          </p>
        </div>
        <CompanyForm type="create" />
      </div>
    </div>
  );
};

export default OnboardingPage;
