/* eslint-disable @typescript-eslint/prefer-for-of */
import { env } from "@/env";
import { EsignEmailJob, type EsignEmailPayloadType } from "@/jobs/esign-email";
import { decode, encode } from "@/lib/jwt";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  and,
  companies,
  db,
  eq,
  esignRecipients,
  inArray,
  notInArray,
  templateFields,
  templates,
} from "@captable/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ZodAddFieldMutationSchema } from "../schema";

const emailTokenPayloadSchema = z.object({
  id: z.string(),
  rec: z.string(),
});

type TEmailTokenPayloadSchema = z.infer<typeof emailTokenPayloadSchema>;

interface EncodeEmailTokenOption {
  templateId: string;
  recipientId: string;
}

export function EncodeEmailToken({
  recipientId,
  templateId,
}: EncodeEmailTokenOption) {
  const encodeToken: TEmailTokenPayloadSchema = {
    rec: recipientId,
    id: templateId,
  };

  return encode(encodeToken);
}

export async function DecodeEmailToken(jwt: string) {
  const { payload } = await decode(jwt);
  return emailTokenPayloadSchema.parse(payload);
}

export const addFieldProcedure = withAuth
  .input(ZodAddFieldMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const user = ctx.session.user;
      const { userAgent, requestIp } = ctx;
      const mails: EsignEmailPayloadType[] = [];

      if (input.status === "COMPLETE" && (!user.email || !user.name)) {
        return {
          success: false,
          title: "Validation failed",
          message: "Required sender name and email",
        };
      }

      const template = await db.transaction(async (tx) => {
        const { companyId } = await checkMembership({
          tx,
          session: ctx.session,
        });

        const templateResult = await tx
          .select({
            id: templates.id,
            name: templates.name,
            completedOn: templates.completedOn,
            orderedDelivery: templates.orderedDelivery,
            companyName: companies.name,
            companyLogo: companies.logo,
          })
          .from(templates)
          .leftJoin(companies, eq(templates.companyId, companies.id))
          .where(
            and(
              eq(templates.publicId, input.templatePublicId),
              eq(templates.companyId, companyId),
              eq(templates.status, "DRAFT"),
            ),
          )
          .limit(1);

        const template = templateResult[0];
        if (!template) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Template not found",
          });
        }

        if (template.completedOn) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "E-signing has already completed among all parties.",
          });
        }

        await tx
          .delete(templateFields)
          .where(eq(templateFields.templateId, template.id));

        const recipientIdList = input.data.map((item) => item.recipientId);
        const recipientList = await tx
          .select({
            id: esignRecipients.id,
            name: esignRecipients.name,
            email: esignRecipients.email,
          })
          .from(esignRecipients)
          .where(
            and(
              eq(esignRecipients.templateId, template.id),
              inArray(esignRecipients.id, recipientIdList),
            ),
          );

        const fieldsList = [];

        for (const field of input.data) {
          if (field) {
            fieldsList.push({
              ...field,
              type: field.type as
                | "TEXT"
                | "RADIO"
                | "EMAIL"
                | "DATE"
                | "DATETIME"
                | "TEXTAREA"
                | "CHECKBOX"
                | "SIGNATURE"
                | "SELECT",
              templateId: template.id,
              updatedAt: new Date(),
            });
          }
        }

        await tx.insert(templateFields).values(fieldsList);

        await Audit.create(
          {
            action: "template.updated",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp: requestIp || "",
            },
            target: [{ type: "template", id: template.id }],
            summary: `${user.name} added templateField for template ID ${template.id}`,
          },
          tx,
        );

        await tx
          .update(templates)
          .set({
            status: input.status as
              | "DRAFT"
              | "COMPLETE"
              | "SENT"
              | "WAITING"
              | "CANCELLED",
            message: input.message,
            updatedAt: new Date(),
          })
          .where(eq(templates.id, template.id));

        if (input.status === "COMPLETE") {
          const nonDeletableRecipientIdList = recipientList.map(
            (item) => item.id,
          );
          await tx
            .delete(esignRecipients)
            .where(
              and(
                eq(esignRecipients.templateId, template.id),
                notInArray(esignRecipients.id, nonDeletableRecipientIdList),
              ),
            );

          for (const recipient of recipientList) {
            if (!recipient) {
              throw new Error("not found");
            }

            const token = await EncodeEmailToken({
              recipientId: recipient.id,
              templateId: template.id,
            });

            const signingLink = `${env.NEXT_PUBLIC_BASE_URL}/esign/${token}`;

            mails.push({
              signingLink,
              recipient: {
                id: recipient.id,
                name: recipient?.name,
                email: recipient.email,
              },
              sender: {
                name: user.name,
                email: user.email,
              },
              message: input?.message,
              documentName: template.name,
              company: {
                name: template.companyName || "",
                logo: template.companyLogo,
              },
            });

            if (template.orderedDelivery) {
              break;
            }
          }
        }

        return template;
      });

      if (mails.length) {
        new EsignEmailJob().bulkEmit(
          mails.map((data) => ({
            data,
            singletonKey: `esign-notify-${template.id}-${data.recipient.id}`,
          })),
        );
      }

      return {
        success: true,
        title:
          input.status === "COMPLETE" ? "Sent for e-sign" : "Saved in draft",
        message:
          input.status === "COMPLETE"
            ? "Successfully sent document for e-signature."
            : "Your template fields has been created.",
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        title: "Error",
        message: "Uh ohh! Something went wrong. Please try again later.",
      };
    }
  });
