import { createTRPCRouter } from "@/trpc/api/trpc";
import { getPermissionsProcedure } from "./procedures/get-permissions";
import { listRolesProcedure } from "./procedures/list-roles";

export const rbacRouter = createTRPCRouter({
  getPermissions: getPermissionsProcedure,
  listRoles: listRolesProcedure,
});
