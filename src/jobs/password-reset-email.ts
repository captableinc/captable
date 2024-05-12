import PasswordResetEmail from '@/emails/PasswordResetEmail'
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

export type TPasswordResetPayloadSchema = z.infer<typeof schema>

export const sendPasswordResetEmail = async (
  payload: TPasswordResetPayloadSchema,
) => {
  const { email, token } = payload
  const baseUrl = env.BASE_URL

  const confirmLink = `${baseUrl}/reset-password/${token}`

  const html = await render(
    PasswordResetEmail({
      resetLink: confirmLink,
    }),
  )

  await sendMail({
    to: email,
    subject: 'Reset your password',
    html,
  })
}

export const triggerName = 'email.password-reset'

client.defineJob({
  id: 'password-reset-email',
  name: 'password reset email',
  version: '0.0.1',
  trigger: eventTrigger({
    name: triggerName,
    schema,
  }),

  run: async (payload, io) => {
    await io.runTask('send password reset email', async () => {
      await sendPasswordResetEmail(payload)
    })
  },
})
