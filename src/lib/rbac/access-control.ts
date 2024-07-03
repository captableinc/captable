import { defaultPermissions } from "@/constants/rbac";
import type { Roles } from "@/prisma/enums";
import { checkMembership, withServerComponentSession } from "@/server/auth";
import { type TPrismaOrTransaction, db } from "@/server/db";
import type { Session } from "next-auth";
import { cache } from "react";
import { RBAC, type addPolicyOption } from ".";
import { Err, Ok, wrap } from "../error";
import { BaseError } from "../error/errors/base";

export interface checkMembershipOptions {
  session: Session;
  tx: TPrismaOrTransaction;
}

class MembershipNotFoundError extends BaseError {
  public readonly name = "MembershipNotFoundError";
  public readonly retry = false;
}

export async function checkAccessControlMembership({
  session,
  tx,
}: checkMembershipOptions) {
  return wrap(
    checkMembership({ session, tx }),
    (err) => new MembershipNotFoundError({ message: err.message }),
  );
}

export function getPermissionsForRole(role: Roles) {
  if (role !== "CUSTOM") {
    return defaultPermissions[role];
  }
  return defaultPermissions.SUPER_USER;
}

interface getPermissionsOptions {
  session: Session;
  db: TPrismaOrTransaction;
}

export async function getPermissions({ db, session }: getPermissionsOptions) {
  const { err: membershipError, val: membership } =
    await checkAccessControlMembership({
      session,
      tx: db,
    });

  if (membershipError) {
    return Err(membershipError);
  }

  const permissions = getPermissionsForRole(membership.role);

  return Ok({ permissions, membership });
}

export const getServerPermissions = cache(async () => {
  const session = await withServerComponentSession();
  const { err, val } = await getPermissions({ session, db });
  if (err) {
    throw err;
  }

  return val;
});

export const checkPageRoleAccess = async (policies: addPolicyOption) => {
  const rbac = new RBAC();

  rbac.addPolicies(policies);

  const { permissions } = await getServerPermissions();

  const { val, err } = rbac.enforce(permissions);

  if (err) {
    throw err;
  }

  const isAllowed = val.valid;

  return { isAllowed };
};
