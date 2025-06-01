import { generatePublicId } from "@/lib/common/id";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { db, documents, shares } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodAddShareMutationSchema } from "../schema";

export const addShareProcedure = withAuth
  .input(ZodAddShareMutationSchema)
  .mutation(async ({ ctx, input }) => {
    console.log({ input }, "#############");

    const { userAgent, requestIp } = ctx;

    try {
      const user = ctx.session.user;
      const documentInputs = input.documents;

      await db.transaction(async (tx) => {
        const { companyId } = await checkMembership({
          session: ctx.session,
          tx,
        });

        const data = {
          companyId,
          stakeholderId: input.stakeholderId,
          shareClassId: input.shareClassId,
          status: input.status as "ACTIVE" | "PENDING" | "DRAFT" | "SIGNED",
          certificateId: input.certificateId,
          quantity: input.quantity,
          pricePerShare: input.pricePerShare,
          capitalContribution: input.capitalContribution,
          ipContribution: input.ipContribution,
          debtCancelled: input.debtCancelled,
          otherContributions: input.otherContributions,
          cliffYears: input.cliffYears,
          vestingYears: input.vestingYears,
          companyLegends: input.companyLegends as (
            | "US_SECURITIES_ACT"
            | "SALE_AND_ROFR"
            | "TRANSFER_RESTRICTIONS"
          )[],
          issueDate: new Date(input.issueDate),
          rule144Date: new Date(input.rule144Date),
          vestingStartDate: new Date(input.vestingStartDate),
          boardApprovalDate: new Date(input.boardApprovalDate),
          updatedAt: new Date(),
        };

        const [share] = await tx
          .insert(shares)
          .values(data)
          .returning({ id: shares.id });

        if (!share) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create share",
          });
        }

        if (documentInputs.length > 0) {
          const bulkDocuments = documentInputs.map((doc) => ({
            companyId,
            uploaderId: user.memberId,
            publicId: generatePublicId(),
            name: doc.name,
            bucketId: doc.bucketId,
            shareId: share.id,
            updatedAt: new Date(),
          }));

          await tx.insert(documents).values(bulkDocuments);
        }

        await Audit.create(
          {
            action: "share.created",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp: requestIp || "",
            },
            target: [{ type: "share", id: share.id }],
            summary: `${user.name} added share for stakeholder ${input.stakeholderId}`,
          },
          tx,
        );
      });

      return {
        success: true,
        message: "🎉 Successfully added a share",
      };
    } catch (error) {
      console.error("Error adding shares: ", error);
      return {
        success: false,
        message: "Please use unique Certificate Id.",
      };
    }
  });
