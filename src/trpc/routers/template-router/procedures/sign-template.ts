import { PDFDocument, StandardFonts } from "pdf-lib";
import { withAuth } from "@/trpc/api/trpc";
import { ZodSignTemplateMutationSchema } from "../schema";
import { getFileFromS3, uploadFile } from "@/common/uploads";
import { createDocumentHandler } from "../../document-router/procedures/create-document";
import { createBucketHandler } from "../../bucket-router/procedures/create-bucket";

export const signTemplateProcedure = withAuth
  .input(ZodSignTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const user = session.user;

    const template = await db.template.findFirstOrThrow({
      where: { publicId: input.templatePublicId },
      include: {
        fields: {
          orderBy: {
            top: "asc",
          },
        },
        bucket: true,
      },
    });

    const docBuffer = await getFileFromS3(template.bucket.key);
    const pdfDoc = await PDFDocument.load(docBuffer);

    const firstPage = pdfDoc.getPages()[0];

    if (!firstPage) {
      throw new Error("page not found");
    }

    const firstField = template.fields[0];

    if (!firstField) {
      throw new Error("page not found");
    }

    const { width: pageWidth, height: pageHeight } = firstPage.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 8;

    for (const field of template.fields) {
      const value = input?.data?.[field?.name];

      if (value) {
        const cord = {
          x: field.left,
          y: pageHeight - (field.top - field.height),
          font,
          size: fontSize,
        };

        firstPage.drawText(value, cord);
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();

    const file = {
      name: `${template.name}`,
      type: "application/pdf",
      arrayBuffer: async () => Promise.resolve(Buffer.from(modifiedPdfBytes)),
      size: 0,
    } as unknown as File;

    const bucketData = await uploadFile(file, {
      identifier: user.companyPublicId,
      keyPrefix: "generic-document",
    });

    const { id: bucketId, name } = await createBucketHandler({
      ctx,
      input: bucketData,
    });

    await createDocumentHandler({
      ctx,
      input: { bucketId, name },
    });

    return {};
  });
