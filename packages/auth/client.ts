import { createAuthClient } from "better-auth/react";
import type { Session } from "./types";

export const { useSession, signIn, signOut, signUp } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
});

// Custom hook for client-side session with member data
export const clientSideSession = () => {
  const { data: baseSession, ...rest } = useSession();

  // This will return the base session from Better Auth
  // For full extended session with member data, use serverSideSession on the server
  return {
    data: baseSession as Session | null,
    ...rest,
  };
};
