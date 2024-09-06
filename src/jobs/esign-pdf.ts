import {
  type EsignGetTemplateType,
  generateEsignPdf,
  uploadEsignDocuments,
} from "@/server/esign";

import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";
import {
  Schema as EsignCompleteSchema,
  eSignCompletePDFJob,
} from "./esign-complete-pdf";

const fields = z.array(z.any()) as z.ZodType<EsignGetTemplateType["fields"]>;

const config = defineWorkerConfig({
  name: "esign.generate-pdf",
  schema: z
    .object({
      fields,
      data: z.record(z.string()),
      audits: z.array(
        z.object({
          id: z.string(),
          summary: z.string(),
          action: z.string(),
          occurredAt: z.date(),
        }),
      ),
      bucketKey: z.string(),
    })
    .merge(EsignCompleteSchema.omit({ bucketData: true })),
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
    templateName,
  });
  const { fileUrl: _fileUrl, ...bucketData } = await uploadEsignDocuments({
    buffer: Buffer.from(modifiedPdfBytes),
    companyId,
    templateName,
  });

  await eSignCompletePDFJob.emit({
    requestIp,
    userAgent,
    sender,
    templateId,
    recipients,
    company,
    bucketData,
    companyId,
    templateName,
  });
});
