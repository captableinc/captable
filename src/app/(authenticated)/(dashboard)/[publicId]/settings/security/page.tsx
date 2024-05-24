import { UpdatePasswordForm } from "@/components/security/password/update-password-form";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
};
export default function SecurityPage() {
  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <div className="gap-y-3">
          <h3 className="font-medium">Security</h3>
          <p className="text-sm text-muted-foreground">
            Manage your password and security settings
          </p>
        </div>
      </div>

      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <UpdatePasswordForm />
      </Card>
    </div>
  );
}
