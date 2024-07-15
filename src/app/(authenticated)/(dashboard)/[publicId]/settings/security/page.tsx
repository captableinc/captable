import { DisableTwoFactorDialog } from "@/components/2fa/disable-2fa-dialog";
import { EnableTwoFactorAppDialog } from "@/components/2fa/enable-2fa-dialog";
import { SecurityList } from "@/components/security/SecurityList";
import { SettingsHeader } from "@/components/security/SettingHeader";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Security",
};

const SecurityLists = [
  {
    title: "Password",
    description: "Update your password to keep your account secure and safe.",
    href: "security/password",
    buttonDisplayName: "Update password",
  },
  {
    title: "Passkeys",
    description: "Add, delete or update passkey configuration.",
    href: "security/passkey",
    buttonDisplayName: "Manage passkeys",
  },
];

export default async function SecurityPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await db.user.findFirstOrThrow({
    where: { id: session.user.id },
  });

  return (
    <>
      <SettingsHeader
        title="Security"
        subtitle="Manage your password and security settings."
        showBackArrow={false}
      />
      {SecurityLists.map((security) => (
        <SecurityList
          key={security.href}
          title={security.title}
          description={security.description}
          href={security.href}
          buttonDisplayName={security.buttonDisplayName}
        />
      ))}

      {user.twoFactorEnabled ? (
        <DisableTwoFactorDialog />
      ) : (
        <EnableTwoFactorAppDialog />
      )}
    </>
  );
}
