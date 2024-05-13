import CheckEmailComponent from "@/components/onboarding/check-email";
import { type Metadata } from "next";
export const metadata: Metadata = {
  title: "Check Email",
};
export default function CheckEmail() {
  return <CheckEmailComponent />;
}
