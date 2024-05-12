import { createTRPCRouter } from '@/trpc/api/trpc'
import { forgotPasswordProcedure } from './procedure/forgot-password'
import { newPasswordProcedure } from './procedure/new-password'
import { resendEmailProcedure } from './procedure/resend-email'
import { signupProcedure } from './procedure/signup'
import { verifyEmailProcedure } from './procedure/verify-email'
export const authRouter = createTRPCRouter({
  signup: signupProcedure,
  resendEmail: resendEmailProcedure,
  verifyEmail: verifyEmailProcedure,
  forgotPassword: forgotPasswordProcedure,
  newPassword: newPasswordProcedure,
})
