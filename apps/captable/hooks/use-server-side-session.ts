import { serverSideSession } from "@captable/auth/server";
import type { Session } from "@captable/auth/types";
import { redirect } from "next/navigation";

export const useServerSideSession = async ({
  headers,
}: {
  headers: Headers;
}) => {
  let session: Session | null = null;

  try {
    session = await serverSideSession({ headers });
  } catch (_error) {
    redirect("/auth");
    return null;
  }

  return session;
};
