import ESignConfirmationEmail from '@/emails/EsignConfirmationEmail'
import { sendMail } from '@/server/mailer'
import { client } from '@/trigger'
import { eventTrigger } from '@trigger.dev/sdk'
import { render } from 'jsx-email'

export type TConfirmationEmailPayload = {
  fileUrl: string
  documentName: string
  senderName: string | null
  company: {
    name: string
    logo?: string | null
  }
  recipient: { name?: string | null; email: string }
}

export const sendEsignConfirmationEmail = async (
  payload: TConfirmationEmailPayload,
) => {
  const html = await render(
    ESignConfirmationEmail({
      documentName: payload.documentName,
      recipient: payload.recipient,
      senderName: payload.senderName,
      company: payload.company,
    }),
  )
  await sendMail({
    to: payload.recipient.email,
    subject: 'Completed e-signed documents from all parties',
    html,
    attachments: [
      {
        filename: payload.documentName,
        path: payload.fileUrl,
      },
    ],
  })
}

client.defineJob({
  id: 'esign-confirmation-email',
  name: 'esign confirmation email',
  version: '0.0.1',
  trigger: eventTrigger({
    name: 'esign.send-confirmation',
  }),

  run: async (payload: TConfirmationEmailPayload, io) => {
    await io.runTask('send confirmation email', async () => {
      await sendEsignConfirmationEmail(payload)
    })
  },
})
