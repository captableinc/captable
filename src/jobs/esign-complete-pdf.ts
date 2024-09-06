import { EsignAudit } from "@/server/audit";
import { db } from "@/server/db";
import { completeEsignDocuments } from "@/server/esign";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";
import { eSignConfirmationEmailJob } from "./esign-confirmation-email";

export const Schema = z.object({
  company: z.object({
    name: z.string(),
    logo: z.string().nullish(),
  }),

  templateId: z.string(),
  requestIp: z.string(),
  userAgent: z.string(),

  templateName: z.string(),
  companyId: z.string(),
  recipients: z.array(
    z.object({
      email: z.string(),
      name: z.string().nullish(),
    }),
  ),
  sender: z.object({
    email: z.string().email(),
    name: z.string(),
  }),
  bucketData: z.object({
    key: z.string(),
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
  }),
});

const config = defineWorkerConfig({
  name: "esign.complete-pdf",
  schema: Schema,
});

export const eSignCompletePDFJob = defineJob(config);
export const eSignCompletePDFWorker = defineWorker(config, async (job) => {
  const {
    companyId,
    templateName,
    requestIp,
    userAgent,
    sender,
    templateId,
    recipients,
    company,
    bucketData,
  } = job.data;

  await db.$transaction(async (tx) => {
    await completeEsignDocuments({
      bucketData: bucketData,
      companyId,
      db: tx,
      requestIp,
      templateId,
      templateName,
      uploaderName: sender.name,
      userAgent,
    });
  });

  const file = await getPresignedGetUrl(bucketData.key);

  await eSignConfirmationEmailJob.bulkEmit(
    recipients.map((recipient) => ({
      data: {
        fileUrl: file.url,
        documentName: templateName,
        recipient,
        company,
        senderName: sender.name,
        senderEmail: sender.email,
      },
    })),
  );
});
