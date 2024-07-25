import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";

export const getOptionsProcedure = withAuth.query(
  async ({ ctx: { db, session } }) => {
    const data = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const option = await tx.option.findMany({
        where: {
          companyId,
        },
        select: {
          id: true,
          grantId: true,
          quantity: true,
          exercisePrice: true,
          type: true,
          status: true,
          cliffYears: true,
          vestingYears: true,
          issueDate: true,
          expirationDate: true,
          vestingStartDate: true,
          boardApprovalDate: true,
          rule144Date: true,
          stakeholder: {
            select: {
              name: true,
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

      return option;
    });

    return { data };
  },
);
