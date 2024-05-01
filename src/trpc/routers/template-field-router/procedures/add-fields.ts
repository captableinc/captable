/* eslint-disable @typescript-eslint/prefer-for-of */
import { sendEsignEmailJob } from "@/jobs";
import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { ZodAddFieldMutationSchema } from "../schema";

export const addFieldProcedure = withAuth
  .input(ZodAddFieldMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const user = ctx.session.user;
      const companyLogo = input.emailPayload.company.logo;

      if (input.completedOn) {
        return {
          success: false,
          message: "E-signing has already completed among all parties.",
        };
      }
      if (!user.email || !user.name || !companyLogo) {
        return {
          success: false,
          message: "Email requires sender name , email and company logo.",
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
            orderedDelivery: true,
          },
        });
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
            ...input.emailPayload,
          });
        }
      });
      return {
        success: true,
        message: "Successfully sent document for e-signature.",
      };
    } catch (error) {
      console.log({ error });
      return {
        success: false,
        message: "Uh ohh! Something went wrong. Please try again later.",
      };
    }
  });
