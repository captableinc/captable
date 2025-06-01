import { generatePublicId } from "@/lib/common/id";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { db, documents, safes } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodAddExistingSafeMutationSchema } from "../schema";

export const addExistingSafeProcedure = withAuth
  .input(ZodAddExistingSafeMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { userAgent, requestIp, session } = ctx;
    const user = ctx.session.user;
    const { documents: documentInputs, ...rest } = input;

    try {
      await db.transaction(async (tx) => {
        const { companyId, memberId } = await checkMembership({ session, tx });

        const [safe] = await tx
          .insert(safes)
          .values({
            publicId: generatePublicId(),
            companyId,
            ...rest,
            issueDate: new Date(input.issueDate),
            boardApprovalDate: new Date(input.boardApprovalDate),
            updatedAt: new Date(),
          })
          .returning({ id: safes.id });

        if (!safe) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create safe",
          });
        }

        if (documentInputs.length > 0) {
          const bulkDocuments = documentInputs.map((doc) => ({
            companyId,
            uploaderId: memberId,
            publicId: generatePublicId(),
            name: doc.name,
            bucketId: doc.bucketId,
            safeId: safe.id,
            updatedAt: new Date(),
          }));

          await tx.insert(documents).values(bulkDocuments);
        }

        await Audit.create(
          {
            action: "safe.imported",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp: requestIp || "",
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
