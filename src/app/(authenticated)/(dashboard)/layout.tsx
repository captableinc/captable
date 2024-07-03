import { withServerComponentSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function OnboardedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await withServerComponentSession();

  if (!session.user.isOnboarded) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
