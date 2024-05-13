import { db } from "@/server/db";
import {
  type TEsignGetTemplate,
  completeEsignDocuments,
  generateEsignPdf,
  uploadEsignDocuments,
} from "@/server/esign";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { type TConfirmationEmailPayload } from "./esign-confirmation-email";

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
  recipients: z.array(
    z.object({ email: z.string(), name: z.string().nullish() }),
  ),
  company: z.object({
    name: z.string(),
    logo: z.string().nullish(),
  }),
});

export type TESignPdfSchema = Omit<z.infer<typeof schema>, "fields"> & {
  fields: TEsignGetTemplate["fields"];
};

client.defineJob({
  id: "esign.complete-pdf",
  name: "esign_complete_pdf",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "esign.sign-pdf",
    schema,
  }),

  run: async (payload, io) => {
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

    await io.runTask("send all recipients confirmation email", async () => {
      const file = await getPresignedGetUrl(uploadedDocument.bucketData.key);

      const data: { name: string; payload: TConfirmationEmailPayload }[] =
        recipients.map((recipient) => ({
          payload: {
            fileUrl: file.url,
            documentName: templateName,
            recipient,
            company,
            senderName: uploaderName,
          },
          name: "esign.send-confirmation",
        }));

      await io.sendEvents(`trigger-confirmation-email`, data);
    });
  },
});
