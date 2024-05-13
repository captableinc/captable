/* eslint-disable @typescript-eslint/prefer-for-of */

import { dayjsExt } from "@/common/dayjs";
import { sendEsignConfirmationEmail } from "@/jobs/esign-confirmation-email";
import { type TEsignEmailJob, sendEsignEmail } from "@/jobs/esign-email";
import { type TESignPdfSchema } from "@/jobs/esign-pdf";
import { EsignAudit } from "@/server/audit";
import {
  type TCompleteEsignDocumentsOptions,
  type TGenerateEsignSignPdfOptions,
  completeEsignDocuments,
  generateEsignPdf,
  getEsignAudits,
  getEsignTemplate,
  uploadEsignDocuments,
  type uploadEsignDocumentsOptions,
} from "@/server/esign";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { getTriggerClient } from "@/trigger";
import { withoutAuth } from "@/trpc/api/trpc";
import { EncodeEmailToken } from "../../template-field-router/procedures/add-fields";
import { ZodSignTemplateMutationSchema } from "../schema";

export const signTemplateProcedure = withoutAuth
  .input(ZodSignTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { db, requestIp, userAgent } = ctx;

    const triggerClient = getTriggerClient();

    await db.$transaction(async (tx) => {
      const template = await getEsignTemplate({
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
            summary: `${recipient.name ? recipient.name : ""} signed "${
              template.name
            }" on ${ctx.userAgent} at ${dayjsExt(new Date()).format("lll")}`,
          },
          tx,
        );

        const allRecipients = await tx.esignRecipient.findMany({
          where: {
            templateId: template.id,
          },
          select: {
            email: true,
            name: true,
            status: true,
          },
        });

        const signableRecipients = allRecipients.filter(
          (item) => item.status !== "SIGNED",
        ).length;

        if (signableRecipients === 0) {
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

          await EsignAudit.create(
            {
              action: "recipient.signed",
              companyId: template.companyId,
              recipientId: recipient.id,
              templateId: template.id,
              ip: ctx.requestIp,
              location: "",
              userAgent: ctx.userAgent,
              summary: `${recipient.name ? recipient.name : ""} signed "${
                template.name
              }" on ${ctx.userAgent} at ${dayjsExt(new Date()).format("lll")}`,
            },
            tx,
          );

          await signPdf({
            bucketKey,
            companyId,
            templateName,
            fields: template.fields,
            uploaderName: "open cap",
            data,
            templateId: template.id,
            db: tx,
            requestIp,
            userAgent,
            company: template.company,
            recipients: allRecipients.map((item) => ({
              email: item.email,
              name: item.name,
            })),
          });
        }
      } else {
        await EsignAudit.create(
          {
            action: "recipient.signed",
            companyId: template.companyId,
            recipientId: recipient.id,
            templateId: template.id,
            ip: ctx.requestIp,
            location: "",
            userAgent: ctx.userAgent,
            summary: `${recipient.name ? recipient.name : ""} signed "${
              template.name
            }" on ${ctx.userAgent} at ${dayjsExt(new Date()).format("lll")}`,
          },
          tx,
        );

        await signPdf({
          bucketKey,
          companyId,
          templateName,
          fields: template.fields,
          uploaderName: recipient.name ?? "unknown signer",
          data: input.data,
          templateId: template.id,
          db: tx,
          requestIp,
          userAgent,
          recipients: [
            {
              email: recipient.email,
              name: recipient.name,
            },
          ],
          company: template.company,
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
            name: true,
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
              summary: `${uploaderName ? uploaderName : ""} sent "${
                template.name
              }" to ${
                recipient.name ? recipient.name : ""
              } for eSignature at ${dayjsExt(new Date()).format("lll")}`,
            },
            tx,
          );

          const payload: TEsignEmailJob = {
            email,
            token,
            message: template.message,
            documentName: template.name,
            recipient: nextDelivery,
            company: template.company,
            sender: template.uploader.user,
          };

          if (triggerClient) {
            await triggerClient.sendEvent({
              name: "email.esign",
              payload,
            });
          } else {
            await sendEsignEmail(payload);
          }
        }
      }
    });

    return {};
  });

interface TSignPdfOptions
  extends Omit<TGenerateEsignSignPdfOptions, "audits">,
    Omit<uploadEsignDocumentsOptions, "buffer">,
    Omit<TCompleteEsignDocumentsOptions, "bucketData"> {
  templateId: string;
  company: {
    name: string;
    logo?: string | null;
  };
  recipients: { name: string | null; email: string }[];
}

async function signPdf({
  userAgent,
  requestIp,
  db,
  bucketKey,
  companyId,
  templateName,
  data,
  fields,
  uploaderName,
  templateId,
  recipients,
  company,
}: TSignPdfOptions) {
  const trigger = getTriggerClient();

  const audits = await getEsignAudits({ templateId, tx: db });

  if (trigger) {
    const payload: TESignPdfSchema = {
      bucketKey,
      data,
      fields,
      audits,
      companyId,
      requestIp,
      templateId,
      templateName,
      uploaderName,
      userAgent,
      recipients,
      company,
    };

    await trigger.sendEvent({
      name: "esign.sign-pdf",
      payload,
    });
  } else {
    const modifiedPdfBytes = await generateEsignPdf({
      bucketKey,
      data,
      fields,
      audits,
    });

    const pdfBuffer = Buffer.from(modifiedPdfBytes);

    const { fileUrl: _fileUrl, ...bucketData } = await uploadEsignDocuments({
      buffer: pdfBuffer,
      companyId,
      templateName,
    });

    await completeEsignDocuments({
      bucketData,
      companyId,
      db,
      requestIp,
      templateId,
      templateName,
      uploaderName,
      userAgent,
    });

    const file = await getPresignedGetUrl(bucketData.key);

    await Promise.all(
      recipients.map((recipient) =>
        sendEsignConfirmationEmail({
          fileUrl: file.url,
          senderName: uploaderName,
          documentName: templateName,
          company,
          recipient,
        }),
      ),
    );
  }
}
