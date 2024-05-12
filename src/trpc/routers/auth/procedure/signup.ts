import {
  type TAuthVerificationPayloadSchema,
  sendAuthVerificationEmail,
  triggerName,
} from '@/jobs/auth-verification-email'

import { generateVerificationToken } from '@/lib/token'
import { getTriggerClient } from '@/trigger'
import { withoutAuth } from '@/trpc/api/trpc'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { ZSignUpMutationSchema } from '../schema'

export const signupProcedure = withoutAuth
  .input(ZSignUpMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const trigger = getTriggerClient()

    const { name, email, password } = input

    const userExists = await ctx.db.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (userExists) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User already exists',
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await ctx.db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    const verificationToken = await generateVerificationToken(email)

    const payload: TAuthVerificationPayloadSchema = {
      email: verificationToken.identifier,
      token: verificationToken.token,
    }

    if (trigger) {
      await trigger.sendEvent({ name: triggerName, payload })
    } else {
      await sendAuthVerificationEmail(payload)
    }

    return {
      success: true,
      message: 'Please check your email to verify your account.',
    }
  })
