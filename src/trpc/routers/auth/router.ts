import { createTRPCRouter } from "@/trpc/api/trpc";
import { signupProcedure } from "./procedure/signup";
import { resendEmailProcedure } from "./procedure/resend-email";
import { verifyEmailProcedure } from "./procedure/verify-email";

export const authRouter = createTRPCRouter({
  signup: signupProcedure,
  resendEmail: resendEmailProcedure,
  verifyEmail: verifyEmailProcedure,
});
