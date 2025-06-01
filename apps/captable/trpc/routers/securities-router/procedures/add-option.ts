import { generatePublicId } from "@/lib/common/id";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { db, documents, options } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodAddOptionMutationSchema } from "../schema";

export const addOptionProcedure = withAuth
  .input(ZodAddOptionMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { userAgent, requestIp } = ctx;
    try {
      const user = ctx.session.user;
      const documentInputs = input.documents;

      await db.transaction(async (tx) => {
        const { companyId } = await checkMembership({
          tx,
          session: ctx.session,
        });

        const data = {
          companyId,
          stakeholderId: input.stakeholderId,
          equityPlanId: input.equityPlanId,
          notes: input.notes,
          grantId: input.grantId,
          quantity: input.quantity,
          exercisePrice: input.exercisePrice,
          type: input.type as "ISO" | "NSO" | "RSU",
          status: input.status as
            | "ACTIVE"
            | "DRAFT"
            | "CANCELLED"
            | "EXERCISED"
            | "EXPIRED",
          cliffYears: input.cliffYears,
          vestingYears: input.vestingYears,
          issueDate: new Date(input.issueDate),
          expirationDate: new Date(input.expirationDate),
          vestingStartDate: new Date(input.vestingStartDate),
          boardApprovalDate: new Date(input.boardApprovalDate),
          rule144Date: new Date(input.rule144Date),
          updatedAt: new Date(),
        };

        const [option] = await tx
          .insert(options)
          .values(data)
          .returning({ id: options.id });

        if (!option) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create option",
          });
        }

        if (documentInputs.length > 0) {
          const bulkDocuments = documentInputs.map((doc) => ({
            companyId,
            uploaderId: user.memberId,
            publicId: generatePublicId(),
            name: doc.name,
            bucketId: doc.bucketId,
            optionId: option.id,
            updatedAt: new Date(),
          }));

          await tx.insert(documents).values(bulkDocuments);
        }

        await Audit.create(
          {
            action: "option.created",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp: requestIp || "",
            },
            target: [{ type: "company", id: companyId }],
            summary: `${user.name} added stock option for stakeholder ${input.stakeholderId}`,
          },
          tx,
        );
      });

      return { success: true, message: "🎉 Successfully added an option" };
    } catch (error) {
      console.error("Error adding options:", error);
      return {
        success: false,
        message: "Please use unique Grant Id.",
      };
    }
  });
