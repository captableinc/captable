import { createTRPCRouter } from "@/trpc/api/trpc";
import { getPermissionsProcedure } from "./procedures/get-permissions";

export const rbacRouter = createTRPCRouter({
  getPermissions: getPermissionsProcedure,
});
