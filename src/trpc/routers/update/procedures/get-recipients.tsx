import { withAuth } from "@/trpc/api/trpc";
import { ZodGetRecipientsProcedure } from "../schema";

export const getRecipientsProcedure = withAuth
  .input(ZodGetRecipientsProcedure)
  .query(async ({ ctx, input }) => {
    if (!input.publicId) {
      return {
        data: [],
        success: false,
        message: "Please provide public id.",
      };
    }

    try {
      const companyId = ctx.session.user.companyId;
      const publicId = input.publicId;
      const updates = await ctx.db.update.findMany({
        where: {
          companyId,
          publicId,
        },
        select: {
          id: true,
          title: true,
          status: true,
          publicId: true,
          companyId: true,
          recipients: {
            select: {
              stakeholderId: true,
              status: true,
              sentAt: true,
              stakeholder: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return { data: updates };
    } catch (error) {
      console.error("Error fetching recipients:", error);
      return {
        data: [],
        success: false,
        message: "Oops, something went wrong. Please try again later.",
      };
    }
  });
