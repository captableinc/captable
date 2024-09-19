import { dayjsExt } from "@/common/dayjs";
import {
  type TESignNotificationEmailJobInput,
  eSignNotificationEmailJob,
} from "@/jobs/esign-email";
import { type TEsignPdfSchema, eSignPdfJob } from "@/jobs/esign-pdf";
import { EsignAudit } from "@/server/audit";
import type { TEsignAuditSchema } from "@/server/audit/schema";
import type { TPrismaOrTransaction } from "@/server/db";
import { type EsignGetTemplateType, getEsignTemplate } from "@/server/esign";
import { EncodeEmailToken } from "@/trpc/routers/template-field-router/procedures/add-fields";
import type { EsignRecipientStatus } from "@prisma/client";

export class EsignService {
  getTemplate(templateId: string, tx: TPrismaOrTransaction) {
    return getEsignTemplate({
      templateId,
      tx,
    });
  }

  getRecipient(
    recipientId: string,
    templateId: string,
    tx: TPrismaOrTransaction,
  ) {
    return tx.esignRecipient.findFirstOrThrow({
      where: {
        id: recipientId,
        templateId,
      },
    });
  }

  updateRecipientStatus(
    recipientId: string,
    status: EsignRecipientStatus,
    tx: TPrismaOrTransaction,
  ) {
    return tx.esignRecipient.update({
      where: { id: recipientId },
      data: { status },
    });
  }

  async handleOrderedDelivery(
    template: EsignGetTemplateType,
    data: Pick<
      TESignNotificationEmailJobInput,
      "sender" | "requestIp" | "userAgent"
    >,
    tx: TPrismaOrTransaction,
  ) {
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
        sender: data.sender,
        message: template.message,
        documentName: template.name,
        recipient: nextDelivery,
        company: template.company,
        companyId: template.companyId,
        requestIp: data.requestIp,
        userAgent: data.userAgent,
      });
    }
  }

  async createSignedAuditLog(
    data: Omit<TEsignAuditSchema, "action" | "summary"> & {
      recipientName?: string | null;
      templateName: string;
      browser?: string;
    },
    tx: TPrismaOrTransaction,
  ) {
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

  async completeDocument(
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

  getAllRecipients(templateId: string, tx: TPrismaOrTransaction) {
    return tx.esignRecipient.findMany({
      where: {
        templateId,
      },
      select: {
        email: true,
        name: true,
        status: true,
      },
    });
  }

  async saveFieldValues(
    fields: EsignGetTemplateType["fields"],
    data: Record<string, string>,
    tx: TPrismaOrTransaction,
  ) {
    for (const field of fields) {
      const value = data?.[field?.id];

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
  }

  async getFieldValues(templateId: string, tx: TPrismaOrTransaction) {
    const values = await tx.templateField.findMany({
      where: {
        templateId,
        prefilledValue: {
          not: null,
        },
      },
      select: {
        id: true,
        prefilledValue: true,
      },
    });

    const data: Record<string, string> = values.reduce<Record<string, string>>(
      (prev, curr) => {
        prev[curr.id] = curr.prefilledValue ?? "";

        return prev;
      },
      {},
    );

    return data;
  }
}
