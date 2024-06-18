/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { env } from "@/env";
import { type SendMailOptions, createTransport } from "nodemailer";

const getTransport = () => {
  return createTransport({
    url: env.EMAIL_SERVER,
  });
};

type RecordType = Record<string, string | undefined>;

export const sendMail = (options: Omit<SendMailOptions, "from">) => {
  let from = `Captable <${env.EMAIL_FROM}>`;
  const headers = (options.headers || {}) as RecordType;

  const senderName = headers["X-From-Name"];

  if (senderName) {
    from = `${senderName} <${env.EMAIL_FROM}>`;
  }

  const transport = getTransport();
  return transport.sendMail({
    from,
    ...options,
  });
};
