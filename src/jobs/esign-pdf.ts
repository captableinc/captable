import {
  type EsignGetTemplateType,
  generateEsignPdf,
  getEsignAudits,
  uploadEsignDocuments,
} from "@/server/esign";

import { dayjsExt } from "@/common/dayjs";
import { EsignAudit } from "@/server/audit";
import { db } from "@/server/db";
import { z } from "zod";
import { defineJob, defineWorker, defineWorkerConfig } from "../lib/queue";
import {
  Schema as EsignCompleteSchema,
  eSignCompletePDFJob,
} from "./esign-complete-pdf";

const fields = z.array(z.any()) as z.ZodType<EsignGetTemplateType["fields"]>;

const schema = z
  .object({
    fields,
    data: z.record(z.string()),
    bucketKey: z.string(),
  })
  .merge(EsignCompleteSchema.omit({ bucketData: true }));

export type TEsignPdfSchema = z.infer<typeof schema>;

const config = defineWorkerConfig({
  name: "esign.generate-pdf",
  schema,
});

export const eSignPdfJob = defineJob(config);
export const eSignPdfWorker = defineWorker(config, async (job) => {
  const {
    bucketKey,
    data,
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

  await EsignAudit.create(
    {
      action: "document.complete",
      companyId,
      templateId,
      ip: requestIp,
      location: "",
      userAgent: userAgent,
      summary: `"${templateName}" completely signed at ${dayjsExt(
        new Date(),
      ).format("lll")}`,
    },
    db,
  );

  const audits = await getEsignAudits({ templateId, tx: db });

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
