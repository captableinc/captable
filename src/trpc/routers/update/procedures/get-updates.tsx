import { withAuth } from "@/trpc/api/trpc";
import { ZodGetUpdateProcedure } from "../schema";

export const getUpdatesProcedure = withAuth
  .input(ZodGetUpdateProcedure)
  .query(async ({ ctx, input }) => {
    try {
      const companyId = ctx.session.user.companyId;
      const publicId = input.publicId;
      const updates = await ctx.db.update.findMany({
        where: {
          companyId,
        },
        select: {
          id: true,
          publicId: true,
          title: true,
          status: true,
          sentAt: true,
          updatedAt: true,
          company: {
            select: {
              publicId: true,
            },
          },
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
      console.error("Error fetching updates:", error);
      return {
        data: [],
        success: false,
        message: "Oops, something went wrong. Please try again later.",
      };
    }
  });
