import { getServerComponentAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerComponentAuthSession();

  if (!session) {
    redirect("/login");
  }
  return <>{children}</>;
}
