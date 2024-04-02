import { withAuth } from "@/trpc/api/trpc";
import { Audit } from "@/server/audit";
import { ZodAddExistingSafeMutationSchema } from "../schema";
import { generatePublicId } from "@/common/id";

export const addExistingSafeProcedure = withAuth
  .input(ZodAddExistingSafeMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { userAgent, requestIp } = ctx;
    const user = ctx.session.user;
    const documents = input.documents;

    // const datas = await ctx.db.safe.deleteMany({})
    // const docss= await ctx.db.document.deleteMany({})
    // console.log({ datas });
    // console.log({ docss });

    try {
      await ctx.db.$transaction(async (tx) => {
        const data = {
          companyId: user.companyId,
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
        console.log({ safe });
        const bulkDocuments = documents.map((doc) => ({
          companyId: user.companyId,
          uploaderId: user.memberId,
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
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "company", id: user.companyId }],
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
