import { withAccessControl } from "@/trpc/api/trpc";

import { type RoleList, defaultRolesList } from "@/constants/rbac";

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
      },
    });

    const customRolesList: RoleList[] = customRoles.map((data) => ({
      ...data,
      type: "custom",
    }));

    return { rolesList: defaultRolesList.concat(customRolesList) };
  });
