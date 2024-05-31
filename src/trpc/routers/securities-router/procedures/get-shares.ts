import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";

export const getSharesProcedure = withAuth.query(
  async ({ ctx: { db, session } }) => {
    const data = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const shares = await tx.share.findMany({
        where: {
          companyId,
        },
        select: {
          id: true,
          certificateId: true,
          quantity: true,
          pricePerShare: true,
          capitalContribution: true,
          ipContribution: true,
          debtCancelled: true,
          otherContributions: true,
          vestingSchedule: true,
          companyLegends: true,
          status: true,

          issueDate: true,
          rule144Date: true,
          vestingStartDate: true,
          boardApprovalDate: true,
          stakeholder: {
            select: {
              name: true,
            },
          },
          shareClass: {
            select: {
              classType: true,
            },
          },
          documents: {
            select: {
              id: true,
              name: true,
              uploader: {
                select: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
              bucket: {
                select: {
                  key: true,
                  mimeType: true,
                  size: true,
                },
              },
            },
          },
        },
      });

      return shares;
    });

    return { data };
  },
);
