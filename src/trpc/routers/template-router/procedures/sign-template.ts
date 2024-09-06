import { EsignService } from "@/services/esign-service";
import { withoutAuth } from "@/trpc/api/trpc";
import { UAParser } from "ua-parser-js";
import { SignTemplateMutationSchema } from "../schema";

export const signTemplateProcedure = withoutAuth
  .input(SignTemplateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { db, requestIp, userAgent } = ctx;

    const userAgentParser = new UAParser(userAgent);
    const userAgentResult = userAgentParser.getResult();
    const browser = userAgentResult.browser.name;

    const eSignService = new EsignService();

    await db.$transaction(async (tx) => {
      const template = await eSignService.getTemplate(input.templateId, tx);

      const bucketKey = template.bucket.key;
      const companyId = template.companyId;
      const templateName = template.name;
      const sender = template.uploader.user;
      const allRecipients = new Set(
        template.fields.map((item) => item.recipientId),
      );
      const isMultiRecipient = allRecipients.size > 1;
      const isOrderedDelivery = template.orderedDelivery;

      const recipient = await eSignService.getRecipient(
        input.recipientId,
        template.id,
        tx,
      );

      await eSignService.updateRecipientStatus(recipient.id, "SIGNED", tx);

      await eSignService.createSignedAuditLog(
        {
          browser,
          companyId,
          recipientId: recipient.id,
          templateId: template.id,
          ip: ctx.requestIp,
          location: "",
          userAgent: ctx.userAgent,
          templateName: template.name,
          recipientName: recipient.name,
        },
        tx,
      );

      if (!isMultiRecipient) {
        await eSignService.completeDocument({
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
      }

      if (isMultiRecipient) {
        await eSignService.saveFieldValues(template.fields, input.data, tx);

        const allRecipients = await eSignService.getAllRecipients(
          template.id,
          tx,
        );
        const areAllRecipientsSigned = allRecipients.every(
          (recipient) => recipient.status === "SIGNED",
        );

        if (areAllRecipientsSigned) {
          const fieldValues = await eSignService.getFieldValues(
            template.id,
            tx,
          );

          await eSignService.completeDocument({
            bucketKey,
            companyId,
            templateName,
            fields: template.fields,
            data: fieldValues,
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
        }
      }

      if (isOrderedDelivery) {
        await eSignService.handleOrderedDelivery(
          template,
          { sender, requestIp, userAgent },
          tx,
        );
      }
    });

    return {};
  });
