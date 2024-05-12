import AccountVerificationEmail from '@/emails/AccountVerificationEmail'
import { env } from '@/env'
import { sendMail } from '@/server/mailer'
import { client } from '@/trigger'
import { eventTrigger } from '@trigger.dev/sdk'
import { render } from 'jsx-email'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  token: z.string(),
})

export type TAuthVerificationPayloadSchema = z.infer<typeof schema>

export const sendAuthVerificationEmail = async (
  payload: TAuthVerificationPayloadSchema,
) => {
  const { email, token } = payload
  const baseUrl = env.BASE_URL

  const confirmLink = `${baseUrl}/verify-email/${token}`

  const html = await render(
    AccountVerificationEmail({
      verifyLink: confirmLink,
    }),
  )

  await sendMail({
    to: email,
    subject: 'Confirm your email',
    html,
  })
}

export const triggerName = 'email.auth-verify'

client.defineJob({
  id: 'auth-verification-email',
  name: 'authentication verification email',
  version: '0.0.1',
  trigger: eventTrigger({
    name: triggerName,
    schema,
  }),

  run: async (payload, io) => {
    await io.runTask('send auth verification email', async () => {
      await sendAuthVerificationEmail(payload)
    })
  },
})
