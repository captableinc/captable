import {
  type TActions,
  type TSubjects,
  defaultPermissions,
  defaultRolesIdMap,
} from "@/constants/rbac";
import { Roles } from "@/prisma/enums";
import { checkMembership, withServerComponentSession } from "@/server/auth";
import { type TPrismaOrTransaction, db } from "@/server/db";
import type { Session } from "next-auth";
import { cache } from "react";
import { z } from "zod";
import { RBAC, type addPolicyOption } from ".";
import { Err, Ok, wrap } from "../error";
import { BaseError } from "../error/errors/base";
import { permissionSchema } from "./schema";

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

interface getPermissionsForRoleOptions {
  role: Roles;
  tx: TPrismaOrTransaction;
  companyId: string;
  customRoleId: string | null;
}

class GetPermissionForRoleError extends BaseError {
  public readonly name = "GetPermissionForRoleError";
  public readonly retry = false;
}

export async function getPermissionsForRole({
  role,
  companyId,
  customRoleId,
  tx,
}: getPermissionsForRoleOptions) {
  if (role !== "CUSTOM") {
    return Ok(defaultPermissions[role]);
  }

  if (!customRoleId) {
    return Err(
      new GetPermissionForRoleError({ message: "customRoleId not found" }),
    );
  }

  const customRole = await tx.role.findFirst({
    where: {
      companyId,
      id: customRoleId,
    },
    select: {
      permissions: true,
    },
  });

  if (!customRole) {
    return Err(
      new GetPermissionForRoleError({ message: "custom role not found" }),
    );
  }

  const { success, data } = z
    .array(permissionSchema)
    .safeParse(customRole.permissions);

  if (!success) {
    return Err(
      new GetPermissionForRoleError({
        message: "error passing permission schema",
      }),
    );
  }

  return Ok(data);
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

  const { err, val: permissions } = await getPermissionsForRole({
    role: membership.role,
    tx: db,
    companyId: membership.companyId,
    customRoleId: membership.customRoleId,
  });

  if (err) {
    return Err(err);
  }

  return Ok({ permissions, membership });
}

interface getRoleByIdOption {
  id: string;
  tx: TPrismaOrTransaction;
}

export const getRoleById = async ({ id, tx }: getRoleByIdOption) => {
  const defaultRole = defaultRolesIdMap?.[id];

  if (defaultRole) {
    return { role: defaultRole, customRoleId: null };
  }
  const { id: customRoleId } = await tx.role.findFirstOrThrow({
    where: { id },
    select: { id: true },
  });

  return { role: Roles.CUSTOM, customRoleId };
};

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

  const roleMap = RBAC.normalizePermissionsMap(permissions);

  const allow = <T>(p: T, permissions: [TSubjects, TActions]) => {
    const subject = permissions[0];
    const action = permissions[1];

    const getSubject = roleMap.get(subject);
    const allowed =
      !!getSubject && (getSubject.includes(action) || getSubject.includes("*"));

    if (allowed) {
      return p;
    }
    return undefined;
  };

  return { isAllowed, roleMap, allow };
};
