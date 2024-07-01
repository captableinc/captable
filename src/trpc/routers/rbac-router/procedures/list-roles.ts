import { withAccessControl } from "@/trpc/api/trpc";

import type { Roles } from "@/prisma/enums";

const humanizedDefaultRoles: Record<Exclude<Roles, "CUSTOM">, string> = {
  BILLING: "Billing",
  EMPLOYEE: "Employee",
  INVESTOR: "Investor",
  SUPER_USER: "Super User",
};

const defaultRoleNames = Object.values(humanizedDefaultRoles);
const defaultRolesList = defaultRoleNames.map((name) => ({
  name,
  isCustom: false,
}));

export const listRolesProcedure = withAccessControl
  .meta({
    policies: {
      roles: { allow: ["read"] },
    },
  })
  .query(() => {
    return { rolesList: defaultRolesList };
  });
