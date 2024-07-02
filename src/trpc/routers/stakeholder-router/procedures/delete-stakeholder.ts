import { checkMembership } from "@/server/auth";
import { deleteStakeholder } from "@/server/services/stakeholder/delete-stakeholder";
import { withAuth } from "@/trpc/api/trpc";
import { z } from "zod";

export const deleteStakeholdersProcedure = withAuth
  .input(
    z.object({
      stakeholderId: z.string(),
    }),
  )
  .mutation(async ({ ctx: { db, session, requestIp, userAgent }, input }) => {
    const { id, name } = session.user;
    try {
      const { companyId } = await checkMembership({ session, tx: db });

      await deleteStakeholder({
        db,
        payload: {
          companyId,
          stakeholderId: input.stakeholderId,
          user: { id, name: name as string },
          requestIp,
          userAgent,
        },
      });
      return {
        success: true,
        message: "Stakeholder deleted successfully!",
      };
    } catch (error) {
      console.error("Error deleting stakeholders:", error);
      return {
        success: false,
        message: "Oops, something went wrong. Please try again later.",
      };
    }
  });
