import { withAccessControl } from "@/trpc/api/trpc";

import { type RoleList, defaultRolesList } from "@/constants/rbac";
import { permissionSchema } from "@/lib/rbac/schema";
import { z } from "zod";

export const listRolesProcedure = withAccessControl
  .meta({
    policies: {
      roles: { allow: ["read"] },
    },
  })
  .query(async ({ ctx }) => {
    const customRoles = await ctx.db.role.findMany({
      where: {
        companyId: ctx.membership.companyId,
      },
      select: {
        id: true,
        name: true,
        permissions: true,
      },
    });

    const customRolesList: RoleList[] = customRoles.map((data) => {
      const permissions = z.array(permissionSchema).parse(data.permissions);
      return {
        ...data,
        type: "custom",
        permissions,
      };
    });

    return { rolesList: defaultRolesList.concat(customRolesList) };
  });
