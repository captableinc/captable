import ShareDataRoomEmail from '@/emails/ShareDataRoomEmail'
import { sendMail } from '@/server/mailer'
import { client } from '@/trigger'
import { eventTrigger } from '@trigger.dev/sdk'
import { render } from 'jsx-email'
import { z } from 'zod'

const schema = z.object({
  dataRoom: z.string(),
  link: z.string(),
  companyName: z.string(),
  recipientName: z.string().nullish(),
  senderName: z.string(),
  senderEmail: z.string().nullish(),
  email: z.string(),
})

export type DataRoomEmailPayloadType = z.infer<typeof schema>

export const sendShareDataRoomEmail = async (
  payload: DataRoomEmailPayloadType,
) => {
  const {
    dataRoom,
    link,
    companyName,
    recipientName,
    senderName,
    email,
    senderEmail,
  } = payload
  await sendMail({
    to: email,
    ...(senderEmail && { replyTo: senderEmail }),
    subject: `${senderName} shared a data room - ${dataRoom}`,
    html: await render(
      ShareDataRoomEmail({
        senderName: senderName,
        recipientName,
        companyName,
        dataRoom,
        link,
      }),
    ),
  })
}

export const triggerName = 'email.share-data-room-email'

client.defineJob({
  id: 'share-data-room-email',
  name: 'data room share email',
  version: '0.0.1',
  trigger: eventTrigger({
    name: triggerName,
    schema,
  }),

  run: async (payload, io) => {
    await io.runTask('send data room share email', async () => {
      await sendShareDataRoomEmail(payload)
    })
  },
})
