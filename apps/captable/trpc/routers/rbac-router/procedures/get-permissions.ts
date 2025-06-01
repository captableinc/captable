import { withAccessControl } from "@/trpc/api/trpc";
import { RBAC } from "@captable/rbac";

export const getPermissionsProcedure = withAccessControl
  .meta({ policies: {} })
  .query(({ ctx: { permissions: perm_ } }) => {
    const permissions = RBAC.normalizePermissionsMap(perm_);

    return { permissions };
  });
