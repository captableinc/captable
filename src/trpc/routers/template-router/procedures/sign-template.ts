/* eslint-disable @typescript-eslint/prefer-for-of */

import { dayjsExt } from "@/common/dayjs";
import { EsignNotificationEmailJob } from "@/jobs/esign-email";
import { EsignPdfJob } from "@/jobs/esign-pdf";
import type { TemplateStatus } from "@/prisma/enums";
import { EsignAudit } from "@/server/audit";
import {
  type CompleteEsignDocumentsOptionsType,
  type GenerateEsignSignPdfOptionsType,
  getEsignAudits,
  getEsignTemplate,
  type uploadEsignDocumentsOptions,
} from "@/server/esign";
import { withoutAuth } from "@/trpc/api/trpc";
import { encodeSignatureToken } from "../../template-field-router/procedures/add-fields";
import { SignTemplateMutationSchema } from "../schema";

export const signTemplateProcedure = withoutAuth
  .input(SignTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { db, requestIp, userAgent } = ctx;

    await db.$transaction(async (tx) => {
      const template = await getEsignTemplate({
        templateId: input.templateId,
        tx,
      });
      const bucketKey = template.bucket.key;
      const companyId = template.companyId;
      const templateName = template.name;
      const sender = template.uploader.user;

      let templateStatus: TemplateStatus = "WAITING";

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

          const data: Record<string, string> = values.reduce<
            Record<string, string>
          >((prev, curr) => {
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
            sender,
            uploaderName: sender.name || "Captable",
          });

          templateStatus = "COMPLETE";
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
          data: input.data,
          templateId: template.id,
          db: tx,
          requestIp,
          userAgent,
          sender,
          recipients: [
            {
              email: recipient.email,
              name: recipient.name,
            },
          ],
          company: template.company,
          uploaderName: sender.name || "Captable",
        });

        templateStatus = "COMPLETE";
      }

      await tx.template.update({
        where: {
          id: template.id,
        },
        data: {
          status: templateStatus,
        },
      });

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
          const token = await encodeSignatureToken({
            recipientId: nextDelivery.id,
            templateId: template.id,
            db: tx,
          });
          const email = nextDelivery.email;

          await EsignAudit.create(
            {
              action: "document.email.sent",
              companyId: template.companyId,
              recipientId: recipient.id,
              templateId: template.id,
              ip: ctx.requestIp,
              location: "",
              userAgent: ctx.userAgent,
              summary: `${sender.name ? sender.name : ""} sent "${
                template.name
              }" to ${
                recipient.name ? recipient.name : ""
              } for eSignature at ${dayjsExt(new Date()).format("lll")}`,
            },
            tx,
          );

          await new EsignNotificationEmailJob().emit({
            email,
            token,
            sender,
            message: template.message,
            documentName: template.name,
            recipient: nextDelivery,
            company: template.company,
          });
        }
      }
    });

    return {};
  });

interface TSignPdfOptions
  extends Omit<GenerateEsignSignPdfOptionsType, "audits">,
    Omit<uploadEsignDocumentsOptions, "buffer">,
    Omit<CompleteEsignDocumentsOptionsType, "bucketData"> {
  templateId: string;
  company: {
    name: string;
    logo?: string | null;
  };
  sender: { name: string | null; email: string | null };
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
  sender,
  templateId,
  recipients,
  company,
}: TSignPdfOptions) {
  const audits = await getEsignAudits({ templateId, tx: db });

  await new EsignPdfJob().emit(
    {
      bucketKey,
      data,
      fields,
      audits,
      companyId,
      requestIp,
      templateId,
      templateName,
      userAgent,
      recipients,
      sender: sender as { email: string; name: string },
      company,
    },
    { singletonKey: `esign-${templateId}`, useSingletonQueue: true },
  );
}
