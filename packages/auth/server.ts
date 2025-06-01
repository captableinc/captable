"use server";

import { and, db, eq, members, sql } from "@captable/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./index";
import type { Session } from "./types";

type ServerSideSessionProps = { headers: Headers };

/**
 * Server-side session with extended member data
 * This is the main session function that includes member information
 */
export const serverSideSession = async ({
  headers,
}: ServerSideSessionProps): Promise<Session> => {
  const session = await auth.api.getSession({
    headers,
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Query for the most recently accessed active member
    const memberRecords = await db.query.members.findMany({
      where: and(
        eq(members.userId, session.user.id),
        eq(members.isOnboarded, true),
        sql`${members.status} = 'ACTIVE'`,
      ),
      orderBy: (members, { desc }) => [desc(members.lastAccessed)],
      limit: 1,
      with: {
        user: true,
        company: true,
      },
    });

    const member = memberRecords[0];

    if (member) {
      // Update last accessed
      await db
        .update(members)
        .set({ lastAccessed: new Date() })
        .where(eq(members.id, member.id));

      // Return extended session with member data
      return {
        ...session,
        user: {
          ...session.user,
          image: session.user.image ?? undefined,
          isOnboarded: member.isOnboarded,
          companyId: member.companyId,
          memberId: member.id,
          companyPublicId: member.company?.publicId ?? "",
          status: member.status,
        },
      };
    }

    // No active member found
    return {
      ...session,
      user: {
        ...session.user,
        image: session.user.image ?? undefined,
        isOnboarded: false,
        companyId: "",
        memberId: "",
        companyPublicId: "",
        status: "" as const,
      },
    };
  } catch (error) {
    console.error("Error fetching member data:", error);
    // Return session without member data if error occurs
    return {
      ...session,
      user: {
        ...session.user,
        image: session.user.image ?? undefined,
        isOnboarded: false,
        companyId: "",
        memberId: "",
        companyPublicId: "",
        status: "" as const,
      },
    };
  }
};

/**
 * Server action for signing in with email and password
 */
export const signInEmailAction = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return result;
};

/**
 * Server action for signing up with email and password
 */
export const signUpEmailAction = async (
  name: string,
  email: string,
  password: string,
) => {
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  return result;
};

/**
 * Server action for signing out
 */
export const signOutAction = async () => {
  const headersList = await headers();
  await auth.api.signOut({
    headers: headersList,
  });
  redirect("/login");
};
