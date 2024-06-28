import { createTRPCRouter } from "@/trpc/api/trpc";
import { getRolesProcedure } from "./procedures/get-roles";

export const rbacRouter = createTRPCRouter({
  getRoles: getRolesProcedure,
});
