import { createTRPCRouter } from "@/trpc/api/trpc";
import { createRolesProcedure } from "./procedures/create-role";
import { deleteRoleProcedure } from "./procedures/delete-role";
import { getPermissionsProcedure } from "./procedures/get-permissions";
import { listRolesProcedure } from "./procedures/list-roles";
import { updateRolesProcedure } from "./procedures/update-roles";

export const rbacRouter = createTRPCRouter({
  getPermissions: getPermissionsProcedure,
  listRoles: listRolesProcedure,
  createRole: createRolesProcedure,
  deleteRole: deleteRoleProcedure,
  updateRole: updateRolesProcedure,
});
