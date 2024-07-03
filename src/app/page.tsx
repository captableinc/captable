import { getServerComponentAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerComponentAuthSession();

  if (session?.user?.companyPublicId) {
    return redirect(`/${session.user.companyPublicId}`);
  }

  return redirect("/login");
}
