import { SettingsHeader } from "@/components/security/SettingHeader";
import PasskeyModal from "@/components/security/passkey/create-passkey-modal";
import PasskeyTable from "@/components/security/passkey/user-passkeys-data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
};
export default async function PasskeyPage() {
  const passkeys = await api.passkey.find.query();
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <SettingsHeader
          title="Manage Passkey"
          subtitle="Add, delete or update passkey configuration"
        />
        <div>
          <PasskeyModal
            title="Add a new passkey"
            subtitle={"Subtitle for passkey"}
            trigger={<Button>Add Passkey</Button>}
          />
        </div>
      </div>
      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <PasskeyTable passkey={passkeys.data} />
      </Card>
    </div>
  );
}
