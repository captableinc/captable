/* eslint-disable @typescript-eslint/prefer-for-of */
import { dayjsExt } from "@/common/dayjs";
import { type TUploadFile, getFileFromS3, uploadFile } from "@/common/uploads";
import { TAG } from "@/lib/tags";
import { AuditLogTemplate } from "@/pdf-templates/audit-log-template";
import { createBucketHandler } from "@/trpc/routers/bucket-router/procedures/create-bucket";
import { createDocumentHandler } from "@/trpc/routers/document-router/procedures/create-document";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { EsignAudit } from "./audit";
import type { PrismaTransactionalClient } from "./db";

interface getEsignAuditsOptions {
  templateId: string;
  tx: PrismaTransactionalClient;
}

export async function getEsignAudits({
  templateId,
  tx,
}: getEsignAuditsOptions) {
  const audits = await tx.esignAudit.findMany({
    where: {
      templateId,
    },
    select: {
      id: true,
      summary: true,
    },
  });
  return audits;
}

type TGetEsignAudits = Awaited<ReturnType<typeof getEsignAudits>>;

interface getEsignTemplateOptions {
  templateId: string;
  tx: PrismaTransactionalClient;
}

export function getEsignTemplate({ tx, templateId }: getEsignTemplateOptions) {
  return tx.template.findFirstOrThrow({
    where: { id: templateId },
    select: {
      bucket: true,
      fields: {
        orderBy: {
          top: "asc",
        },
      },
      companyId: true,
      id: true,
      name: true,
      orderedDelivery: true,
      uploader: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      message: true,
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });
}

export type EsignGetTemplateType = Awaited<ReturnType<typeof getEsignTemplate>>;

type Field = EsignGetTemplateType["fields"][number];
interface TGetFieldValue {
  type: Field["type"];
  id: Field["id"];
  data: Record<string, string>;
  meta: Field["meta"];
}

export const getFieldValue = ({ type, id, data, meta }: TGetFieldValue) => {
  const value = data?.[id];

  const selectValue = meta?.options
    ? meta.options.find((val) => val.id === value)?.value
    : undefined;

  return value
    ? type === "DATE"
      ? dayjsExt(value).format("DD/MM/YYYY")
      : type === "SELECT"
        ? selectValue
        : value
    : undefined;
};

export interface GenerateEsignSignPdfOptionsType {
  bucketKey: string;
  data: Record<string, string>;
  fields: EsignGetTemplateType["fields"];
  audits: TGetEsignAudits;
}

export async function generateEsignPdf({
  bucketKey,
  data,
  fields,
  audits,
}: GenerateEsignSignPdfOptionsType) {
  const docBuffer = await getFileFromS3(bucketKey);
  const pdfDoc = await PDFDocument.load(docBuffer);

  const pages = pdfDoc.getPages();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 8;
  const textHeight = font.heightAtSize(fontSize);

  for (const field of fields) {
    const value = getFieldValue({
      data,
      id: field.id,
      meta: field.meta,
      type: field.type,
    });

    if (value) {
      const pageNumber = field.page - 1;

      const page = pages.at(pageNumber);

      if (!page) {
        throw new Error("page not found");
      }

      const { width: pageWidth, height: pageHeight } = page.getSize();

      const widthRatio = pageWidth / field.viewportWidth;
      const heightRatio = pageHeight / field.viewportHeight;

      const fieldX = field.left * widthRatio;

      const fieldY = field.top * heightRatio;
      const height = field.height * heightRatio;
      const width = height;

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

  if (audits.length) {
    const audit = await renderToBuffer(AuditLogTemplate({ audits }));
    const auditPDFDoc = await PDFDocument.load(audit);
    const indices = auditPDFDoc.getPageIndices();
    const copiedPages = await pdfDoc.copyPages(auditPDFDoc, indices);

    for (const auditPage of copiedPages) {
      if (auditPage) {
        pdfDoc.addPage(auditPage);
      }
    }
  }

  const modifiedPdfBytes = await pdfDoc.save();

  return modifiedPdfBytes;
}

export interface uploadEsignDocumentsOptions {
  buffer: Buffer;
  templateName: string;
  companyId: string;
}

export async function uploadEsignDocuments({
  buffer,
  companyId,
  templateName,
}: uploadEsignDocumentsOptions) {
  const file = {
    name: templateName,
    type: "application/pdf",
    arrayBuffer: async () => Promise.resolve(buffer),
    size: 0,
  } as unknown as File;

  const data = await uploadFile(file, {
    identifier: companyId,
    keyPrefix: "signed-esign-doc",
  });

  return data;
}

export interface CompleteEsignDocumentsOptionsType {
  templateName: string;
  companyId: string;
  db: PrismaTransactionalClient;
  requestIp: string;
  userAgent: string;
  uploaderName: string;
  templateId: string;
  bucketData: Omit<TUploadFile, "fileUrl">;
}

export async function completeEsignDocuments({
  companyId,
  db,
  requestIp,
  templateId,
  templateName,
  uploaderName,
  userAgent,
  bucketData,
}: CompleteEsignDocumentsOptionsType) {
  await db.template.update({
    where: {
      id: templateId,
    },
    data: {
      completedOn: new Date(),
    },
  });

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

  const { id: bucketId, name } = await createBucketHandler({
    db,
    input: { ...bucketData, tags: [TAG.ESIGN] },
  });

  await createDocumentHandler({
    input: { bucketId, name },
    requestIp,
    db,
    userAgent,
    companyId,
    uploaderName,
  });
}
