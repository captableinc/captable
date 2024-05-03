/* eslint-disable @typescript-eslint/prefer-for-of */
import { sendEsignEmailJob } from "@/jobs";
import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { ZodAddFieldMutationSchema } from "../schema";

export const addFieldProcedure = withAuth
  .input(ZodAddFieldMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const user = ctx.session.user;

      if (input.status === "COMPLETE" && (!user.email || !user.name)) {
        return {
          success: false,
          title: "Validation failed",
          message: "Required sender name and email",
        };
      }

      await ctx.db.$transaction(async (tx) => {
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

        const recipientList = await tx.esignRecipient.findMany({
          where: {
            templateId: template.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        const fieldsList = [];

        for (let index = 0; index < input.data.length; index++) {
          const field = input.data[index];

          if (field) {
            fieldsList.push({ ...field, templateId: template.id });
          }
        }

        await tx.templateField.createMany({
          data: fieldsList,
        });

        await tx.template.update({
          where: {
            id: template.id,
          },
          data: {
            status: input.status,
            optionalMessage: input.optionalMessage,
          },
        });

        if (input.status === "COMPLETE") {
          //eslint-disable-next-line @typescript-eslint/no-floating-promises
          sendEsignEmailJob.invoke({
            orderedDelivery: template.orderedDelivery,
            templateId: template.id,
            recipients: recipientList,
            sender: {
              name: user.name,
              email: user.email,
            },
            optionalMessage: input?.optionalMessage,
            documentName: template.name,
            company: {
              name: template.company.name,
              logo: template.company.logo,
            },
          });
        }
      });
      return {
        success: true,
        title:
          input.status === "COMPLETE" ? "Sent for e-sign" : "Saved in draft",
        message:
          input.status === "COMPLETE"
            ? "Successfully sent document for e-signature."
            : "Successfully saved as draft template.",
      };
    } catch (error) {
      console.log({ error });
      if (error instanceof TRPCError) {
        return {
          success: false,
          title: "Bad request",
          message: error.message,
        };
      } else {
        return {
          success: false,
          title: "Error",
          message: "Uh ohh! Something went wrong. Please try again later.",
        };
      }
    }
  });
