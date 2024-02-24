import { Navbar } from "@/components/navbar";
import CompanyForm from "@/components/onboarding/conpany-form";
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

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-5 pb-5 pt-20">
      <Navbar />

      <div className="border-rounded w-full max-w-2xl border bg-white p-10 shadow">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to OpenCap!
          </h1>
          <p className="text-sm text-muted-foreground">
            You are almost there. Please complete the form below to continue
          </p>
        </div>
        <CompanyForm formType="onboarding" currentUser={user} />
      </div>
    </div>
  );
};

export default OnboardingPage;
