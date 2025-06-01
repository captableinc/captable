import { useServerSideSession } from "@/hooks/use-server-side-session";
import { createHash } from "@/lib/crypto";
import type { Session } from "@captable/auth/types";
import {
  type DBTransaction,
  and,
  customRoles,
  db,
  eq,
  inArray,
  members,
  users,
  verificationTokens,
} from "@captable/db";
import type { RoleEnum } from "@captable/db";
import { ADMIN_ROLE_ID } from "@captable/rbac";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { cache } from "react";

export const checkVerificationToken = async (
  token: string,
  userEmail: string | null | undefined,
) => {
  // based on https://github.com/nextauthjs/next-auth/blob/46264fb42af4c3ef7137a5694875eaa1309462ea/packages/core/src/lib/actions/callback/index.ts#L200
  const invite = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  const hasInvite = !!invite;
  const expired = invite ? invite.expires.valueOf() < Date.now() : undefined;
  const invalidInvite = !hasInvite || expired;

  if (invalidInvite) {
    throw new Error("invalid invite or invite expired");
  }

  const [email, memberId] = invite.identifier.split(":");

  if (!memberId) {
    throw new Error("member id not found");
  }

  if (!email) {
    throw new Error("user email not found");
  }

  if (userEmail !== email) {
    throw new Error("invalid email");
  }

  return { memberId, email };
};

interface generateMemberIdentifierOptions {
  email: string;
  memberId: string;
}

export const generateMemberIdentifier = ({
  email,
  memberId,
}: generateMemberIdentifierOptions) => {
  return `${email}:${memberId}`;
};

export async function generateInviteToken() {
  const ONE_DAY_IN_SECONDS = 86400;
  const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

  const memberInviteTokenHash = await createHash(`member-${nanoid(16)}`);
  return { expires, memberInviteTokenHash };
}

interface revokeExistingInviteTokensOptions {
  memberId: string;
  email: string;
  tx?: DBTransaction;
}

export async function revokeExistingInviteTokens({
  email,
  memberId,
  tx,
}: revokeExistingInviteTokensOptions) {
  const dbClient = tx ?? db;

  const identifier = generateMemberIdentifier({
    email,
    memberId,
  });

  const verificationToken = await dbClient.query.verificationTokens.findMany({
    where: eq(verificationTokens.identifier, identifier),
  });

  await dbClient.delete(verificationTokens).where(
    inArray(
      verificationTokens.token,
      verificationToken.map((item) => item.token),
    ),
  );
}

export interface checkMembershipOptions {
  session: Session;
  tx: DBTransaction;
}

export async function checkMembership({ session, tx }: checkMembershipOptions) {
  const memberRecord = await tx.query.members.findFirst({
    where: and(
      eq(members.id, session.user.memberId),
      eq(members.companyId, session.user.companyId),
      eq(members.isOnboarded, true),
    ),
    columns: {
      id: true,
      companyId: true,
      role: true,
      customRoleId: true,
      userId: true,
    },
  });

  if (!memberRecord) {
    throw new Error("Membership not found");
  }

  // Get user data separately
  const userRecord = await tx
    .select({
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, memberRecord.userId))
    .limit(1);

  const user =
    userRecord.length > 0 ? userRecord[0] : { name: null, email: null };

  const { companyId, id: memberId, ...rest } = memberRecord;

  return {
    companyId,
    memberId,
    ...rest,
    user,
  };
}

// RBAC and Role-related functions

// Simple getRoleById function for backward compatibility
export const getRoleById = async ({
  id,
  tx,
}: {
  id?: string | null;
  tx: DBTransaction;
}) => {
  if (!id || id === "") {
    return { role: null, customRoleId: null };
  }

  if (id === ADMIN_ROLE_ID) {
    return { role: "ADMIN" as RoleEnum, customRoleId: null };
  }

  const [result] = await tx
    .select({ id: customRoles.id })
    .from(customRoles)
    .where(eq(customRoles.id, id))
    .limit(1);

  if (!result) {
    throw new Error("Custom role not found");
  }

  return { role: "CUSTOM" as RoleEnum, customRoleId: result.id };
};

// Backward compatibility functions
export const checkAccessControlMembership = async ({
  session,
  tx,
}: {
  session: Session;
  tx: DBTransaction;
}) => {
  try {
    const membership = await checkMembership({ session, tx });
    return { err: null, val: membership };
  } catch (error) {
    return { err: error, val: null };
  }
};

export const getPermissions = async ({
  session,
  db: tx,
}: {
  session: Session;
  db: DBTransaction;
}) => {
  try {
    const membership = await checkMembership({ session, tx });
    // Return basic structure - apps can enhance this as needed
    return {
      err: null,
      val: {
        permissions: [], // Basic empty permissions for now
        membership,
      },
    };
  } catch (error) {
    return { err: error, val: null };
  }
};

// Server-side functions for backward compatibility
export const getServerPermissions = cache(
  async ({ headers }: { headers: Headers }) => {
    const session = await useServerSideSession({ headers });

    if (!session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Just return basic permissions and membership for now
    const membership = await checkMembership({
      session,
      tx: {} as DBTransaction,
    });
    return {
      permissions: [],
      membership,
    };
  },
);

export const serverAccessControl = async ({
  headers: _headers,
}: { headers: Headers }) => {
  // Basic implementation for backward compatibility
  return {
    allow: <T>(value: T, _permission: [string, string], _fallback?: T) => {
      // For now, just return the value (no actual permission checking)
      return value;
    },
    hasPermission: (_subject: string, _action: string) => true, // Always allow for now
    isPermissionsAllowed: (_policies: Record<string, unknown>) => ({
      isAllowed: true,
    }),
    roleMap: new Map(),
    permissions: [],
  };
};
