/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { env } from '@/env'
import { type SendMailOptions, createTransport } from 'nodemailer'

const getTransport = () => {
  if (env.EMAIL_SERVER) {
    return createTransport(env.EMAIL_SERVER)
  }

  return createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    secure: env.EMAIL_SERVER_SECURE,
    ...(env.EMAIL_SERVER_PASSWORD &&
      env.EMAIL_SERVER_USERNAME && {
        auth: {
          user: env.EMAIL_SERVER_USERNAME,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      }),
  })
}

export const sendMail = (options: Omit<SendMailOptions, 'from'>) => {
  const transport = getTransport()
  return transport.sendMail({
    from: env.EMAIL_FROM,
    ...options,
  })
}
