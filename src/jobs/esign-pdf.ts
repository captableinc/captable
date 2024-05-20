import { BaseJob } from "@/jobs/base";
import { db } from "@/server/db";
import {
  type EsignGetTemplateType,
  completeEsignDocuments,
  generateEsignPdf,
  uploadEsignDocuments,
} from "@/server/esign";
import { getPresignedGetUrl } from "@/server/file-uploads";
import type { Job } from "pg-boss";
import {
  type ConfirmationEmailPayloadType,
  EsignConfirmationEmailJob,
} from "./esign-confirmation-email";

export type EsignPdfPayloadType = {
  fields: EsignGetTemplateType["fields"];
  company: {
    name: string;
    logo?: string | null | undefined;
  };
  data: Record<string, string>;
  templateId: string;
  requestIp: string;
  userAgent: string;
  audits: {
    id: string;
    summary: string;
  }[];
  bucketKey: string;
  templateName: string;
  companyId: string;
  uploaderName: string;
  recipients: { email: string; name?: string | null }[];
};

export class EsignPdfJob extends BaseJob<EsignPdfPayloadType> {
  readonly type = "generate.esign-pdf";

  async work(job: Job<EsignPdfPayloadType>): Promise<void> {
    const {
      bucketKey,
      data,
      audits,
      fields,
      companyId,
      templateName,
      requestIp,
      userAgent,
      uploaderName,
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
        uploaderName,
        userAgent,
      });
    });

    const file = await getPresignedGetUrl(bucketData.key);

    const recipientData: { data: ConfirmationEmailPayloadType }[] =
      recipients.map((recipient) => ({
        data: {
          fileUrl: file.url,
          documentName: templateName,
          recipient,
          company,
          senderName: uploaderName,
        },
      }));

    await new EsignConfirmationEmailJob().bulkEmit(recipientData);
  }
}
