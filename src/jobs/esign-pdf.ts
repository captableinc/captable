import { db } from "@/server/db";
import {
  completeEsignDocuments,
  generateEsignPdf,
  getEmailSpecificInfoFromTemplate,
  uploadEsignDocuments,
  type TEsignGetTemplate,
} from "@/server/esign";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { client } from "@/trigger";
import { invokeTrigger } from "@trigger.dev/sdk";
import { z } from "zod";

const schema = z.object({
  bucketKey: z.string(),
  data: z.record(z.string()),
  audits: z.array(z.object({ id: z.string(), summary: z.string() })),
  fields: z.array(z.any()),
  companyId: z.string(),
  templateName: z.string(),
  requestIp: z.string(),
  templateId: z.string(),
  uploaderName: z.string(),
  userAgent: z.string(),
});

export type TESignPdfSchema = Omit<z.infer<typeof schema>, "fields"> & {
  fields: TEsignGetTemplate["fields"];
};
type TPayload = z.infer<typeof schema>;

export const CompleteSignDocumentJob = client.defineJob({
  id: "esign.complete-pdf",
  name: "esign_complete_pdf",
  version: "0.0.1",
  trigger: invokeTrigger(),

  run: async (payload: TPayload, io) => {
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
    } = payload;

    const uploadedDocument = await io.runTask("upload documents", async () => {
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

      return { bucketData, _fileUrl };
    });

    await io.runTask("complete document", async () => {
      await db.$transaction(async (tx) => {
        await completeEsignDocuments({
          bucketData: uploadedDocument.bucketData,
          companyId,
          db: tx,
          requestIp,
          templateId,
          templateName,
          uploaderName,
          userAgent,
        });
      });
    });

    await io.runTask("send-confirmation-email", async () => {
      const _fileUrl = await getPresignedGetUrl(
        uploadedDocument.bucketData.key,
      );
      const _payload = await getEmailSpecificInfoFromTemplate(templateId, db);
      const payload = {
        documentName: _payload.documentName,
        senderName: _payload.senderName,
        company: _payload.company,
        fileUrl: _fileUrl.url,
        recipients: _payload.recipients,
        kind: "RECIPIENTS",
      };

      await io.sendEvent(`trigger-confirmation-email`, {
        name: "esign.send-confirmation",
        payload,
      });
    });
  },
});
