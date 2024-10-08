import {
  type TESignNotificationEmailJobInput,
  eSignNotificationEmailJob,
} from "@/jobs/esign-email";
import { decode, encode } from "@/lib/jwt";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
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
      const mails: TESignNotificationEmailJobInput[] = [];

      if (input.status === "PENDING" && (!user.email || !user.name)) {
        return {
          success: false,
          title: "Validation failed",
          message: "Required sender name and email",
        };
      }

      const template = await ctx.db.$transaction(async (tx) => {
        const { companyId } = await checkMembership({
          tx,
          session: ctx.session,
        });

        const template = await tx.template.findFirstOrThrow({
          where: {
            publicId: input.templatePublicId,
            companyId,
            status: "DRAFT",
          },
          select: {
            id: true,
            name: true,
            completedOn: true,
            orderedDelivery: true,
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        });

        if (template.completedOn) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "E-signing has already completed among all parties.",
          });
        }

        await tx.templateField.deleteMany({
          where: {
            templateId: template.id,
          },
        });

        const recipientIdList = input.data.map((item) => item.recipientId);
        const recipientList = await tx.esignRecipient.findMany({
          where: {
            templateId: template.id,
            id: {
              in: recipientIdList,
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        const fieldsList = [];

        for (const field of input.data) {
          if (field) {
            fieldsList.push({ ...field, templateId: template.id });
          }
        }

        await tx.templateField.createMany({
          data: fieldsList,
        });

        await Audit.create(
          {
            action: "template.updated",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "template", id: template.id }],
            summary: `${user.name} added templateField for template ID ${template.id}`,
          },
          tx,
        );

        await tx.template.update({
          where: {
            id: template.id,
          },
          data: {
            status: input.status,
            message: input.message,
          },
        });

        if (input.status === "PENDING") {
          const nonDeletableRecipientIdList = recipientList.map(
            (item) => item.id,
          );
          await tx.esignRecipient.deleteMany({
            where: {
              templateId: template.id,
              id: {
                notIn: nonDeletableRecipientIdList,
              },
            },
          });

          for (const recipient of recipientList) {
            if (!recipient) {
              throw new Error("not found");
            }

            const token = await EncodeEmailToken({
              recipientId: recipient.id,
              templateId: template.id,
            });

            const email = recipient.email;

            mails.push({
              token,
              email,
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
                name: template.company.name,
                logo: template.company.logo,
              },
              requestIp,
              companyId,
              userAgent,
            });

            if (template.orderedDelivery) {
              break;
            }
          }
        }

        return template;
      });

      if (mails.length) {
        await eSignNotificationEmailJob.bulkEmit(
          mails.map((data) => ({
            data,
            singletonKey: `esign-notify-${template.id}-${data.recipient.id}`,
          })),
        );
      }

      return {
        success: true,
        title:
          input.status === "PENDING" ? "Sent for e-sign" : "Saved in draft",
        message:
          input.status === "PENDING"
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
