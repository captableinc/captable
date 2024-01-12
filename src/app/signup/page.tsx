import SignupForm from "@/components/onboarding/signup";
import { type Metadata } from "next";
export const metadata: Metadata = {
  title: "OpenCap - Sign Up",
  description: "Create an account with OpenCap",
};

export default function Onboarding() {
  return <SignupForm />;
}
