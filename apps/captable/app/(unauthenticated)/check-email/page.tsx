import CheckEmailComponent from "@/components/onboarding/check-email";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Check Email",
};

export const dynamic = "force-dynamic";

export default function CheckEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckEmailComponent />
    </Suspense>
  );
}
