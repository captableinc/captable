import { RBAC } from "@/lib/rbac";
import { withAccessControl } from "@/trpc/api/trpc";

export const getRolesProcedure = withAccessControl
  .meta({ policies: {} })
  .query(({ ctx: { permissions } }) => {
    const roles = RBAC.normalizePermissionsMap(permissions);

    return { roles };
  });
