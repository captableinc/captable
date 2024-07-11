import { SecurityList } from "@/components/security/SecurityList";
import { SettingsHeader } from "@/components/security/SettingHeader";
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
  {
    title: "Two factor authentication",
    description: "Add an extra layer of security to your account.",
    href: "security/2fa",
    buttonDisplayName: "Manage 2FA",
  },
];

export default async function SecurityPage() {
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
    </>
  );
}
