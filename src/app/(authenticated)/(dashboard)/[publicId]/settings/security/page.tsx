import { SecurityList } from "@/components/security/SecurityList";
import { SettingsHeader } from "@/components/security/SettingHeader";
import { getServerAuthSession } from "@/server/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Security",
};

const SecurityLists = [
  {
    title: "Change your password",
    description:
      "Let's update your current password with something more secure",
    href: "security/password",
    buttonDisplayName: "Update",
  },
  {
    title: "Passkeys",
    description: `Allows authenticating using biometrics, password managers,
    hardware keys, etc.`,
    href: "security/passkey",
    buttonDisplayName: "Manage",
  },
  {
    title: "Two factor authentication",
    description:
      "Add an authenticator to make password signing more secure and authentic.",
    href: "security/2fa",
    buttonDisplayName: "Add 2FA",
  },
];

export default async function SecurityPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }
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
