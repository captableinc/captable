import { withAuth } from "@/trpc/api/trpc";

export const getOptionsProcedure = withAuth.query(async ({ ctx }) => {
  try {
    const user = ctx.session.user;

    const data = await ctx.db.option.findMany({
      where: {
        companyId: user.companyId,
      },
      select: {
        id: true,
        grantId: true,
        quantity: true,
        exercisePrice: true,
        type: true,
        status: true,
        vestingSchedule: true,
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
            uploader: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            bucket: {
              select: {
                name: true,
                key: true,
                mimeType: true,
                size: true,
              },
            },
          },
        },
      },
    });

    return { data };
  } catch (error) {
    console.error("Error getting stock options of company:", error);
    return {
      success: false,
      message: "Oops, something went wrong.",
    };
  }
});
