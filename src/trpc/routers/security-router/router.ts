import { createTRPCRouter } from "@/trpc/api/trpc";
import { updatePasswordProcedure } from "./procedures/update-password";

export const securityRouter = createTRPCRouter({
  updatePassword: updatePasswordProcedure,
});
