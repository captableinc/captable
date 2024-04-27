import { type Metadata } from "next";
import CheckEmailComponent from "@/components/onboarding/check-email";
export const metadata: Metadata = {
  title: "Check Email",
};
export default function CheckEmail() {
  return <CheckEmailComponent />;
}
