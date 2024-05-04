import { db } from "@/server/db";
import {
  completeEsignDocuments,
  generateEsignPdf,
  uploadEsignDocuments,
  type TEsignGetTemplate,
} from "@/server/esign";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
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

client.defineJob({
  id: "esign pdf",
  name: "sign esign pdf",
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
    } = payload;

    const bucketData = await io.runTask("upload documents", async () => {
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

      return bucketData;
    });

    await io.runTask("complete document", async () => {
      await db.$transaction(async (tx) => {
        await completeEsignDocuments({
          bucketData,
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
  },
});
