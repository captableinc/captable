import { generatePublicId } from "@/common/id";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { ZodAddExistingSafeMutationSchema } from "../schema";

export const addExistingSafeProcedure = withAuth
  .input(ZodAddExistingSafeMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { userAgent, requestIp, session } = ctx;
    const user = ctx.session.user;
    const documents = input.documents;

    try {
      await ctx.db.$transaction(async (tx) => {
        const { companyId, memberId } = await checkMembership({ session, tx });

        const data = {
          companyId,
          stakeholderId: input.stakeholderId,
          publicId: generatePublicId(),
          capital: input.capital,
          valuationCap: input.valuationCap,
          discountRate: input.discountRate,
          proRata: input.proRata,
          issueDate: new Date(input.issueDate),
          boardApprovalDate: new Date(input.boardApprovalDate),
        };

        const safe = await tx.safe.create({ data });

        const bulkDocuments = documents.map((doc) => ({
          companyId,
          uploaderId: memberId,
          publicId: generatePublicId(),
          name: doc.name,
          bucketId: doc.bucketId,
          safeId: safe.id,
        }));

        await tx.document.createMany({
          data: bulkDocuments,
          skipDuplicates: true,
        });

        await Audit.create(
          {
            action: "safe.imported",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "company", id: companyId }],
            summary: `${user.name} imported existing SAFEs.`,
          },
          tx,
        );
      });

      return {
        success: true,
        message: "SAFEs imported for the stakeholder.",
      };
    } catch (error) {
      console.error("Error adding existing SAFEs:", error);
      return {
        success: false,
        message: "Something went wrong.",
      };
    }
  });
