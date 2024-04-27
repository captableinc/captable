import { Card } from "@/components/ui/card";
import { UpdatePassword } from "@/components/settings/security/updatePassword";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
};
const SecurityPage = async () => {
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
        <UpdatePassword />
      </Card>
    </div>
  );
};

export default SecurityPage;
