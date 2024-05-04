/* eslint-disable @typescript-eslint/prefer-for-of */

import { dayjsExt } from "@/common/dayjs";
import { getFileFromS3, uploadFile } from "@/common/uploads";
import { sendEsignEmail } from "@/jobs/esign-email";
import { generateRange, type Range } from "@/lib/pdf-positioning";
import { AuditLogTemplate } from "@/pdf-templates/audit-log-template";
import { EsignAudit } from "@/server/audit";
import { type PrismaTransactionalClient } from "@/server/db";
import { getTriggerClient } from "@/trigger";
import { withoutAuth, type CreateTRPCContextType } from "@/trpc/api/trpc";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { createBucketHandler } from "../../bucket-router/procedures/create-bucket";
import { createDocumentHandler } from "../../document-router/procedures/create-document";
import { EncodeEmailToken } from "../../template-field-router/procedures/add-fields";
import { ZodSignTemplateMutationSchema } from "../schema";

export const signTemplateProcedure = withoutAuth
  .input(ZodSignTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;

    const triggerClient = getTriggerClient();

    await db.$transaction(async (tx) => {
      const template = await getTemplate({
        templateId: input.templateId,
        tx,
      });
      const bucketKey = template.bucket.key;
      const companyId = template.companyId;
      const templateName = template.name;

      const totalGroups = new Set(
        template.fields.map((item) => item.recipientId),
      );

      const recipient = await tx.esignRecipient.findFirstOrThrow({
        where: {
          id: input.recipientId,
          templateId: template.id,
        },
      });

      await tx.esignRecipient.update({
        where: { id: recipient.id },
        data: { status: "SIGNED" },
      });

      if (totalGroups.size > 1) {
        for (const field of template.fields) {
          const value = input?.data?.[field?.id];

          if (value) {
            await tx.templateField.update({
              where: {
                id: field.id,
              },
              data: {
                prefilledValue: value,
              },
            });
          }
        }

        await EsignAudit.create(
          {
            action: "recipient.signed",
            companyId: template.companyId,
            recipientId: recipient.id,
            templateId: template.id,
            ip: ctx.requestIp,
            location: "",
            userAgent: ctx.userAgent,
            summary: `${recipient.name ? recipient.name : ""} signed "${template.name}" on ${ctx.userAgent} at ${dayjsExt(new Date()).format("lll")}`,
          },
          tx,
        );

        const signableRecepients = await tx.esignRecipient.count({
          where: {
            templateId: template.id,
            status: "PENDING",
          },
        });

        if (signableRecepients === 0) {
          const values = await tx.templateField.findMany({
            where: {
              templateId: template.id,
              prefilledValue: {
                not: null,
              },
            },
            select: {
              id: true,
              prefilledValue: true,
            },
          });

          const data = values.reduce<Record<string, string>>((prev, curr) => {
            prev[curr.id] = curr.prefilledValue ?? "";

            return prev;
          }, {});

          await tx.template.update({
            where: {
              id: template.id,
            },
            data: {
              completedOn: new Date(),
            },
          });

          await EsignAudit.create(
            {
              action: "recipient.signed",
              companyId: template.companyId,
              recipientId: recipient.id,
              templateId: template.id,
              ip: ctx.requestIp,
              location: "",
              userAgent: ctx.userAgent,
              summary: `${recipient.name ? recipient.name : ""} signed "${template.name}" on ${ctx.userAgent} at ${dayjsExt(new Date()).format("lll")}`,
            },
            tx,
          );

          await EsignAudit.create(
            {
              action: "document.complete",
              companyId: template.companyId,
              recipientId: recipient.id,
              templateId: template.id,
              ip: ctx.requestIp,
              location: "",
              userAgent: ctx.userAgent,
              summary: `"${template.name}" completely signed at ${dayjsExt(new Date()).format("lll")}`,
            },
            tx,
          );

          await signPdf({
            bucketKey,
            companyId,
            ctx: { ...ctx, db: tx },
            templateName,
            fields: template.fields,
            uploaderName: "open cap",
            data,
            templateId: template.id,
          });
        }
      } else {
        await tx.template.update({
          where: {
            id: template.id,
          },
          data: {
            completedOn: new Date(),
          },
        });

        await EsignAudit.create(
          {
            action: "recipient.signed",
            companyId: template.companyId,
            recipientId: recipient.id,
            templateId: template.id,
            ip: ctx.requestIp,
            location: "",
            userAgent: ctx.userAgent,
            summary: `${recipient.name ? recipient.name : ""} signed "${template.name}" on ${ctx.userAgent} at ${dayjsExt(new Date()).format("lll")}`,
          },
          tx,
        );

        await EsignAudit.create(
          {
            action: "document.complete",
            companyId: template.companyId,
            recipientId: recipient.id,
            templateId: template.id,
            ip: ctx.requestIp,
            location: "",
            userAgent: ctx.userAgent,
            summary: `"${template.name}" completely signed at ${dayjsExt(new Date()).format("lll")}`,
          },
          tx,
        );

        await signPdf({
          bucketKey,
          companyId,
          ctx: { ...ctx, db: tx },
          templateName,
          fields: template.fields,
          uploaderName: recipient.name ?? "unknown signer",
          data: input.data,
          templateId: template.id,
        });
      }

      if (template.orderedDelivery) {
        const nextDelivery = await tx.esignRecipient.findFirst({
          where: {
            templateId: template.id,
            status: "PENDING",
          },
          select: {
            id: true,
            email: true,
          },
        });
        if (nextDelivery) {
          const token = await EncodeEmailToken({
            recipientId: nextDelivery.id,
            templateId: template.id,
          });
          const email = nextDelivery.email;

          const uploaderName = template.uploader.user.name;

          await EsignAudit.create(
            {
              action: "document.email.sent",
              companyId: template.companyId,
              recipientId: recipient.id,
              templateId: template.id,
              ip: ctx.requestIp,
              location: "",
              userAgent: ctx.userAgent,
              summary: `${uploaderName ? uploaderName : ""} sent "${template.name}" to ${recipient.name ? recipient.name : ""} for eSignature at ${dayjsExt(new Date()).format("lll")}`,
            },
            tx,
          );

          if (triggerClient) {
            await triggerClient.sendEvent({
              name: "email.esign",
              payload: { token, email },
            });
          } else {
            await sendEsignEmail({ token, email });
          }
        }
      }
    });

    return {};
  });

interface getTemplateOptions {
  templateId: string;
  tx: PrismaTransactionalClient;
}

function getTemplate({ tx, templateId }: getTemplateOptions) {
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
            },
          },
        },
      },
    },
  });
}

type TGetTemplate = Awaited<ReturnType<typeof getTemplate>>;

interface TSignPdfOptions {
  ctx: Omit<CreateTRPCContextType, "db"> & { db: PrismaTransactionalClient };
  bucketKey: string;
  companyId: string;
  templateName: string;
  data: Record<string, string>;
  fields: TGetTemplate["fields"];
  uploaderName: string;
  templateId: string;
}

async function signPdf({
  ctx,
  bucketKey,
  companyId,
  templateName,
  data,
  fields,
  uploaderName,
  templateId,
}: TSignPdfOptions) {
  const { db, requestIp, userAgent } = ctx;

  const docBuffer = await getFileFromS3(bucketKey);
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

  for (const field of fields) {
    const value = data?.[field?.id];

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

  const audits = await db.esignAudit.findMany({
    where: {
      templateId,
    },
    select: {
      id: true,
      summary: true,
    },
  });

  if (audits.length) {
    const audit = await renderToBuffer(AuditLogTemplate({ audits }));
    const auditPDFDoc = await PDFDocument.load(audit);
    const indices = auditPDFDoc.getPageIndices();
    const copiedPages = await pdfDoc.copyPages(auditPDFDoc, indices);

    for (let index = 0; index < copiedPages.length; index++) {
      const auditPage = copiedPages[index];
      if (auditPage) {
        pdfDoc.addPage(auditPage);
      }
    }
  }

  const modifiedPdfBytes = await pdfDoc.save();

  const file = {
    name: templateName,
    type: "application/pdf",
    arrayBuffer: async () => Promise.resolve(Buffer.from(modifiedPdfBytes)),
    size: 0,
  } as unknown as File;

  const { fileUrl: _fileUrl, ...bucketData } = await uploadFile(file, {
    identifier: companyId,
    keyPrefix: "generic-document",
  });

  const { id: bucketId, name } = await createBucketHandler({
    db,
    input: bucketData,
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
