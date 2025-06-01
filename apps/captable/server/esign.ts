import { dayjsExt } from "@/lib/common/dayjs";
import {
  type TUploadFile,
  getFileFromS3,
  uploadFile,
} from "@/lib/common/uploads";
import { AuditLogTemplate } from "@/lib/pdf-templates/audit-log-template";
import { TAG } from "@/lib/tags";
import { createBucketHandler } from "@/trpc/routers/bucket-router/procedures/create-bucket";
import { createDocumentHandler } from "@/trpc/routers/document-router/procedures/create-document";
import type { DBTransaction } from "@captable/db";
import { eq } from "@captable/db";
import {
  buckets,
  companies,
  esignAudits,
  members,
  templateFields,
  templates,
  users,
} from "@captable/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { EsignAudit } from "./audit";

interface getEsignAuditsOptions {
  templateId: string;
  tx: DBTransaction;
}

export async function getEsignAudits({
  templateId,
  tx,
}: getEsignAuditsOptions) {
  const audits = await tx
    .select({
      id: esignAudits.id,
      summary: esignAudits.summary,
      occurredAt: esignAudits.occurredAt,
      action: esignAudits.action,
    })
    .from(esignAudits)
    .where(eq(esignAudits.templateId, templateId));

  return audits;
}

export type TGetEsignAudits = Awaited<ReturnType<typeof getEsignAudits>>;

interface getEsignTemplateOptions {
  templateId: string;
  tx: DBTransaction;
}

export async function getEsignTemplate({
  tx,
  templateId,
}: getEsignTemplateOptions) {
  // Get template
  const [template] = await tx
    .select({
      id: templates.id,
      name: templates.name,
      orderedDelivery: templates.orderedDelivery,
      message: templates.message,
      companyId: templates.companyId,
      bucketId: templates.bucketId,
      uploaderId: templates.uploaderId,
    })
    .from(templates)
    .where(eq(templates.id, templateId))
    .limit(1);

  if (!template) {
    throw new Error("Template not found");
  }

  // Get fields with ordering
  const fields = await tx
    .select()
    .from(templateFields)
    .where(eq(templateFields.templateId, templateId))
    .orderBy(templateFields.top);

  // Get bucket information
  const [bucket] = await tx
    .select()
    .from(buckets)
    .where(eq(buckets.id, template.bucketId));

  // Get company information
  const [company] = await tx
    .select({
      name: companies.name,
      logo: companies.logo,
    })
    .from(companies)
    .where(eq(companies.id, template.companyId));

  // Get uploader information
  const [uploader] = await tx
    .select({
      user: {
        name: users.name,
        email: users.email,
      },
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .where(eq(members.id, template.uploaderId));

  return {
    ...template,
    fields,
    bucket,
    company,
    uploader,
  };
}

export type EsignGetTemplateType = Awaited<ReturnType<typeof getEsignTemplate>>;

type Field = EsignGetTemplateType["fields"][number];

// Define the expected structure of the meta JSON field
interface FieldMeta {
  options?: Array<{ id: string; value: string }>;
  [key: string]: unknown;
}

interface TGetFieldValue {
  type: Field["type"];
  id: Field["id"];
  data: Record<string, string>;
  meta: FieldMeta;
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
  templateName: string;
}

export async function generateEsignPdf({
  bucketKey,
  data,
  fields,
  audits,
  templateName,
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
      meta: field.meta as unknown as FieldMeta,
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
    const audit = await renderToBuffer(
      AuditLogTemplate({ audits, templateName }),
    );
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
  db: DBTransaction;
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
  await db
    .update(templates)
    .set({
      completedOn: new Date(),
    })
    .where(eq(templates.id, templateId));

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
    userAgent,
    requestIp,
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
