import { useServerSideSession } from "@/hooks/use-server-side-session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a request object from headers for Better Auth
  const session = await useServerSideSession({ headers: await headers() });

  if (!session?.user.isOnboarded) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
