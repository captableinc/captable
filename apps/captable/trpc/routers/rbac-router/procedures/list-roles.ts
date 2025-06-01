import { withAccessControl } from "@/trpc/api/trpc";
import { customRoles, db, eq } from "@captable/db";
import { DEFAULT_ADMIN_ROLE, type RoleList } from "@captable/rbac";
import { permissionSchema } from "@captable/rbac/types";
import { z } from "zod";

export const listRolesProcedure = withAccessControl
  .meta({
    policies: {
      roles: { allow: ["read"] },
    },
  })
  .query(async ({ ctx }) => {
    const customRolesData = await db
      .select({
        id: customRoles.id,
        name: customRoles.name,
        permissions: customRoles.permissions,
      })
      .from(customRoles)
      .where(eq(customRoles.companyId, ctx.membership.companyId));

    const defaultRolesList = [DEFAULT_ADMIN_ROLE];

    const customRolesList: RoleList[] = customRolesData.map((data) => {
      // Parse permissions from string array back to permission objects
      const parsedPermissions =
        data.permissions
          ?.map((permission) => {
            try {
              return JSON.parse(permission);
            } catch {
              return null;
            }
          })
          .filter(Boolean) || [];

      const permissions = z.array(permissionSchema).parse(parsedPermissions);
      return {
        ...data,
        type: "custom",
        permissions,
      };
    });

    return {
      rolesList: defaultRolesList.concat(customRolesList),
    };
  });
