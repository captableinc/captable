import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import PasskeyModal from "@/components/security/create-passkey-modal";
import PasskeyTable from "@/components/security/user-passkeys-data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Manage passkeys",
};

export default async function PasskeysPage() {
  const passkeys = await api.passkey.find.query();
  const isPasskeyEnabled = true;

  if (!isPasskeyEnabled) {
    redirect("/settings/security");
  }
  console.log({ passkeys });
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Passkey</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new passkey
          </p>
        </div>
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
