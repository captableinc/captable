import { SecurityHeader } from "@/components/security/SecurityHeader";
import { SecurityList } from "@/components/security/SecurityList";
import { getServerAuthSession } from "@/server/auth";
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
    title: "Google Account",
    description: "Connect / disconnect your member account with Google Oauth",
    href: "security/google",
    buttonDisplayName: "Manage Oauth",
  },
  {
    title: "Two factor authentication",
    description: "Add an extra layer of security to your account.",
    href: "security/2fa",
    buttonDisplayName: "Manage 2FA",
  },
];

export default async function SecurityPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <>
      <SecurityHeader
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
