/* eslint-disable @typescript-eslint/prefer-for-of */

import { PDFDocument, StandardFonts } from "pdf-lib";
import { withAuth } from "@/trpc/api/trpc";
import { ZodSignTemplateMutationSchema } from "../schema";
import { getFileFromS3, uploadFile } from "@/common/uploads";
import { createDocumentHandler } from "../../document-router/procedures/create-document";
import { createBucketHandler } from "../../bucket-router/procedures/create-bucket";
import { generateRange, type Range } from "@/lib/pdf-positioning";

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

    const pages = pdfDoc.getPages();

    let cumulativePagesHeight = 0;
    const measurements = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (page) {
        const height = page.getHeight();
        const width = page.getWidth();
        cumulativePagesHeight += height;
        measurements.push({ height, width });
      }
    }

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 8;
    const textHeight = font.heightAtSize(fontSize);

    const pageRangeCache: Record<string, Range[]> = {};

    for (const field of template.fields) {
      const value = input?.data?.[field?.name];

      if (value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const pageNumber: number = field.page;

        const page = pages.at(pageNumber);

        if (!page) {
          throw new Error("page not found");
        }

        const cacheKey = String(field.viewportHeight);
        let pagesRange = pageRangeCache?.[cacheKey];

        if (!pagesRange) {
          const range = generateRange(measurements, field.viewportWidth);
          pageRangeCache[cacheKey] = range;
          pagesRange = range;
        }

        const { width: pageWidth, height: pageHeight } = page.getSize();
        const topMargin = pagesRange?.[pageNumber]?.[0] ?? 0;

        const widthRatio = pageWidth / field.viewportWidth;

        const totalHeightRatio = cumulativePagesHeight / field.viewportHeight;

        const fieldX = field.left * widthRatio;

        const top = field.top - topMargin;
        const fieldY = top * widthRatio;
        const width = field.width * widthRatio;
        const height = field.height * totalHeightRatio;

        if (field.type === "SIGNATURE") {
          const image = await pdfDoc.embedPng(value);

          const updatedY = fieldY + height;

          page.drawImage(image, {
            x: fieldX,
            y: pageHeight - updatedY,
            width,
            height,
          });
        } else {
          const padding = (height + textHeight) / 2;
          page.drawText(value, {
            x: fieldX,
            y: pageHeight - fieldY - padding,
            font,
            size: fontSize,
          });
        }
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();

    const file = {
      name: `${template.name}`,
      type: "application/pdf",
      arrayBuffer: async () => Promise.resolve(Buffer.from(modifiedPdfBytes)),
      size: 0,
    } as unknown as File;

    const { fileUrl: _fileUrl, ...bucketData } = await uploadFile(file, {
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
