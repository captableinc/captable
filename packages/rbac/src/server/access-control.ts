import { RBAC, type addPolicyOption } from "../core/rbac.js";
import type { TActions } from "../types/actions.js";
import type { TPermission } from "../types/schema.js";
import type { TSubjects } from "../types/subjects.js";

export interface AccessControlOptions {
  permissions: TPermission[];
}

export function createServerAccessControl({
  permissions,
}: AccessControlOptions) {
  const roleMap = RBAC.normalizePermissionsMap(permissions);

  const allow = <T, U = undefined>(
    p: T,
    permission: [TSubjects, TActions],
    undefinedValue?: U,
  ) => {
    const subject = permission[0];
    const action = permission[1];

    const subjectPermissions = roleMap.get(subject);
    const allowed =
      !!subjectPermissions &&
      (subjectPermissions.includes(action) || subjectPermissions.includes("*"));

    if (allowed) {
      return p;
    }
    return undefinedValue as U;
  };

  const isPermissionsAllowed = (policies: addPolicyOption) => {
    const rbac = new RBAC();
    rbac.addPolicies(policies);

    const result = rbac.enforce(permissions);
    const isAllowed = result.valid;

    return { isAllowed, message: result.message };
  };

  const hasPermission = (subject: TSubjects, action: TActions): boolean => {
    const subjectPermissions = roleMap.get(subject);
    return (
      !!subjectPermissions &&
      (subjectPermissions.includes(action) || subjectPermissions.includes("*"))
    );
  };

  return {
    isPermissionsAllowed,
    roleMap,
    allow,
    hasPermission,
    permissions,
  };
}
