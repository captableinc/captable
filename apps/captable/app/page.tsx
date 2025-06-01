import { serverSideSession } from "@captable/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  try {
    const session = await serverSideSession({ headers: await headers() });

    if (session?.user?.companyPublicId) {
      return redirect(`/${session.user.companyPublicId}`);
    }
  } catch (_error) {
    // No session, redirect to login
  }

  return redirect("/login");
}
