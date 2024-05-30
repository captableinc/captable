import { SecurityHeader } from "@/components/security/SecurityHeader";
import { UpdatePasswordForm } from "@/components/security/password/update-password-form";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
};
export default function UpdatePasswordPage() {
  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <SecurityHeader
          title="Update Password"
          subtitle="Update your password to keep your account secure and safe."
        />
      </div>

      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <UpdatePasswordForm />
      </Card>
    </div>
  );
}
