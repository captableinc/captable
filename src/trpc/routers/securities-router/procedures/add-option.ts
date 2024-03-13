import { withAuth } from "@/trpc/api/trpc";
import { Audit } from "@/server/audit";
import { AddOptionMutationSchema } from "../schema";
import { generatePublicId } from "@/common/id";

export const addOptionProcedure = withAuth
  .input(AddOptionMutationSchema)
  .mutation(async ({ ctx, input }) => {
    console.log({ input });
    const { userAgent, requestIp } = ctx;
    try {
      const user = ctx.session.user;
      const documents = input.documents;

      await ctx.db.$transaction(async (tx) => {
        const data = {
          companyId: user.companyId,
          stakeholderId: input.stakeholderId,
          equityPlanId: input.equityPlanId,
          notes: input.notes,
          grantId: input.grantId,
          quantity: input.quantity,
          exercisePrice: input.exercisePrice,
          type: input.type,
          status: input.status,
          vestingSchedule: input.vestingSchedule,
          issueDate: new Date(input.issueDate),
          expirationDate: new Date(input.expirationDate),
          vestingStartDate: new Date(input.vestingStartDate),
          boardApprovalDate: new Date(input.boardApprovalDate),
          rule144Date: new Date(input.rule144Date),
        };

        const option = await tx.option.create({ data });

        const bulkDocuments = documents.map((doc) => ({
          companyId: user.companyId,
          uploaderId: user.memberId,
          publicId: generatePublicId(),
          name: doc.name,
          bucketId: doc.bucketId,
          optionId: option.id,
        }));

        await tx.document.createMany({
          data: bulkDocuments,
          skipDuplicates: true,
        });

        await Audit.create(
          {
            action: "option.created",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "company", id: user.companyId }],
            summary: `${user.name} added stock option for stakeholder ${input.stakeholderId}`,
          },
          tx,
        );
      });

      return { success: true, message: "New option added successfully" };
    } catch (error) {
      console.error("Error adding options:", error);
      return {
        success: false,
        message: "Oops, something went wrong.",
      };
    }
  });
