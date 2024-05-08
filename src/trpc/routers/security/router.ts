import { createTRPCRouter } from "@/trpc/api/trpc";
import { changePasswordProcedure } from "./procedures/change-password";

export const securityRouter = createTRPCRouter({
  changePassword: changePasswordProcedure,
});
