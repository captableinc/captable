import { dayjsExt } from "@/common/dayjs";
import { eSignNotificationEmailJob } from "@/jobs/esign-email";
import { type TEsignPdfSchema, eSignPdfJob } from "@/jobs/esign-pdf";
import type { TemplateStatus } from "@/prisma/enums";
import { EsignAudit } from "@/server/audit";
import type { TEsignAuditSchema } from "@/server/audit/schema";
import type { TPrismaOrTransaction } from "@/server/db";
import { getEsignTemplate } from "@/server/esign";
import { withoutAuth } from "@/trpc/api/trpc";
import { UAParser } from "ua-parser-js";
import { EncodeEmailToken } from "../../template-field-router/procedures/add-fields";
import { SignTemplateMutationSchema } from "../schema";

export const signTemplateProcedure = withoutAuth
  .input(SignTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { db, requestIp, userAgent } = ctx;

    const userAgentParser = new UAParser(userAgent);
    const userAgentResult = userAgentParser.getResult();
    const browser = userAgentResult.browser.name;

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

        await createSignedAuditLog({
          data: {
            browser,
            companyId: template.companyId,
            recipientId: recipient.id,
            templateId: template.id,
            ip: ctx.requestIp,
            location: "",
            userAgent: ctx.userAgent,
            templateName: template.name,
            recipientName: recipient.name,
          },
          tx,
        });

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

          await createSignedAuditLog({
            data: {
              browser,
              companyId: template.companyId,
              recipientId: recipient.id,
              templateId: template.id,
              ip: ctx.requestIp,
              location: "",
              userAgent: ctx.userAgent,
              templateName: template.name,
              recipientName: recipient.name,
            },
            tx,
          });

          await completeDocument({
            bucketKey,
            companyId,
            templateName,
            fields: template.fields,
            data,
            templateId: template.id,
            requestIp,
            userAgent,
            company: template.company,
            recipients: allRecipients.map((item) => ({
              email: item.email,
              name: item.name,
            })),
            sender,
          });

          templateStatus = "COMPLETE";
        }
      } else {
        await createSignedAuditLog({
          data: {
            browser,
            companyId: template.companyId,
            recipientId: recipient.id,
            templateId: template.id,
            ip: ctx.requestIp,
            location: "",
            userAgent: ctx.userAgent,
            templateName: template.name,
            recipientName: recipient.name,
          },
          tx,
        });

        await completeDocument({
          companyId,
          templateName,
          fields: template.fields,
          data: input.data,
          templateId: template.id,
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
          bucketKey,
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
          const token = await EncodeEmailToken({
            recipientId: nextDelivery.id,
            templateId: template.id,
          });
          const email = nextDelivery.email;

          await eSignNotificationEmailJob.emit({
            email,
            token,
            sender,
            message: template.message,
            documentName: template.name,
            recipient: nextDelivery,
            company: template.company,
            companyId: template.companyId,
            requestIp: ctx.requestIp,
            userAgent: ctx.userAgent,
          });
        }
      }
    });

    return {};
  });

interface TCreateSignedAuditLogOptions {
  data: Omit<TEsignAuditSchema, "action" | "summary"> & {
    recipientName?: string | null;
    templateName: string;
    browser?: string;
  };
  tx: TPrismaOrTransaction;
}

async function createSignedAuditLog({
  data,
  tx,
}: TCreateSignedAuditLogOptions) {
  const { recipientName, templateName, browser, ...rest } = data;

  await EsignAudit.create(
    {
      action: "recipient.signed",
      ...rest,
      summary: `${
        recipientName ?? "unknown recipient"
      } signed "${templateName}" on ${
        browser ?? "unknown browser"
      } at ${dayjsExt(new Date()).format("lll")}`,
    },
    tx,
  );
}

async function completeDocument(
  options: Omit<TEsignPdfSchema, "sender"> & {
    sender: {
      name: string | null;
      email: string | null;
    };
  },
) {
  await eSignPdfJob.emit(
    {
      ...options,
      sender: {
        name: options.sender.name ?? "Captable",
        email: options.sender.email ?? "Unknown email",
      },
    },
    {
      singletonKey: `esign-${options.templateId}`,
    },
  );
}
