import { dayjsExt } from "@/common/dayjs";
import EsignEmail from "@/emails/EsignEmail";
import { env } from "@/env";
import { EsignAudit } from "@/server/audit";
import { db } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { render } from "@react-email/components";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";

const Schema = z.object({
  documentName: z.string().optional(),
  message: z.string().nullish(),
  recipient: z.object({
    id: z.string(),
    name: z.string().nullish(),
    email: z.string().email(),
  }),
  sender: z
    .object({
      name: z.string().nullish(),
      email: z.string().email().nullish(),
    })
    .optional(),
  company: z
    .object({
      name: z.string(),
      logo: z.string().nullish(),
    })
    .optional(),
  email: z.string().email(),
  token: z.string(),
  userAgent: z.string(),
  requestIp: z.string(),
  companyId: z.string(),
});

export type TESignNotificationEmailJobInput = z.infer<typeof Schema>;

const config = defineWorkerConfig({
  name: "email.esign-notification",
  schema: Schema,
});

export const eSignNotificationEmailJob = defineJob(config);
export const eSignNotificationEmailWorker = defineWorker(
  config,
  async (job) => {
    const {
      email,
      token,
      sender,
      userAgent,
      requestIp,
      documentName,
      companyId,
      ...rest
    } = job.data;

    const baseUrl = env.NEXT_PUBLIC_BASE_URL;

    await db.$transaction(async (tx) => {
      const recipient = await tx.esignRecipient.update({
        where: {
          id: job.data.recipient.id,
        },
        data: {
          status: "SENT",
        },
      });

      await EsignAudit.create(
        {
          action: "document.email.sent",
          companyId,
          recipientId: recipient.id,
          templateId: recipient.templateId,
          ip: requestIp,
          location: "",
          userAgent,
          summary: `${
            sender?.name ? sender.name : ""
          } sent "${documentName}" to ${
            recipient.name ? recipient.name : ""
          } for eSignature at ${dayjsExt(new Date()).format("lll")}`,
        },
        tx,
      );
    });

    const html = await render(
      EsignEmail({
        signingLink: `${baseUrl}/esign/${token}`,
        sender,
        documentName,
        ...rest,
      }),
    );
    await sendMail({
      to: email,
      ...(sender?.email && { replyTo: sender.email }),
      subject: "eSign Document Request",
      html,
      headers: {
        "X-From-Name": sender?.name || "Captable",
      },
    });
  },
);
