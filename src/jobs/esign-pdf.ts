import { db } from "@/server/db";
import {
  type EsignGetTemplateType,
  completeEsignDocuments,
  generateEsignPdf,
  uploadEsignDocuments,
} from "@/server/esign";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { z } from "zod";
import { eSignConfirmationEmailJob } from "./esign-confirmation-email";
import { defineJob, defineWorker, defineWorkerConfig } from "./queue";

const fields = z.array(z.any()) as z.ZodType<EsignGetTemplateType["fields"]>;

const config = defineWorkerConfig({
  name: "generate.esign-pdf",
  schema: z.object({
    fields,
    company: z.object({
      name: z.string(),
      logo: z.string().nullish(),
    }),
    data: z.record(z.string()),
    templateId: z.string(),
    requestIp: z.string(),
    userAgent: z.string(),
    audits: z.array(
      z.object({
        id: z.string(),
        summary: z.string(),
      }),
    ),
    bucketKey: z.string(),
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
      name: z.string().nullish(),
    }),
  }),
});

export const eSignPdfJob = defineJob(config);
export const eSignPdfWorker = defineWorker(config, async (job) => {
  const {
    bucketKey,
    data,
    audits,
    fields,
    companyId,
    templateName,
    requestIp,
    userAgent,
    sender,
    templateId,
    recipients,
    company,
  } = job.data;

  const modifiedPdfBytes = await generateEsignPdf({
    bucketKey,
    data,
    fields,
    audits,
  });
  const { fileUrl: _fileUrl, ...bucketData } = await uploadEsignDocuments({
    buffer: Buffer.from(modifiedPdfBytes),
    companyId,
    templateName,
  });

  await db.$transaction(async (tx) => {
    await completeEsignDocuments({
      bucketData: bucketData,
      companyId,
      db: tx,
      requestIp,
      templateId,
      templateName,
      uploaderName: sender.name || "Captable",
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
        senderName: sender.name || "Captable",
        senderEmail: sender.email as string,
      },
    })),
  );
});
