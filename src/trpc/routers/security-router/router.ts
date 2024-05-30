import { createTRPCRouter } from "@/trpc/api/trpc";
import { connectGoogleProcedure } from "./procedures/connect-google";
import { disConnectGoogleProcedure } from "./procedures/disconnect-google";
import { updatePasswordProcedure } from "./procedures/update-password";

export const securityRouter = createTRPCRouter({
  updatePassword: updatePasswordProcedure,
  connectGoogle: connectGoogleProcedure,
  disconnectGoogle: disConnectGoogleProcedure,
});
