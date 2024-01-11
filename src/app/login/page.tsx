import LoginForm from "@/components/onboarding/login";
import { type Metadata } from "next";
export const metadata: Metadata = {
  title: "OpenCap - Login",
  description: "Login to OpenCap",
}

export default function AuthPage() {
  return (
    <LoginForm />
  )
};
