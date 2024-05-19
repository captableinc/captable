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

export const sendMail = (options: Omit<SendMailOptions, "from">) => {
  const transport = getTransport();
  return transport.sendMail({
    from: env.EMAIL_FROM,
    ...options,
  });
};
