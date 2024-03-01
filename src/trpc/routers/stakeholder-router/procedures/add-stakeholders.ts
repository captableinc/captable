import { withAuth } from "@/trpc/api/trpc";
import { ZodAddStakeholderArrayMutationSchema } from "../schema";

export const addStakeholdersProcedure = withAuth
  .input(ZodAddStakeholderArrayMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const companyId = ctx.session.user.companyId;

      // insert companyId in every input
      const inputDataWithCompanyId = input.map((stakeholder) => ({
        ...stakeholder,
        companyId,
      }));

      await ctx.db.stakeholder.createMany({
        data: inputDataWithCompanyId,
        skipDuplicates: true,
      });

      return {
        success: true,
        message: "Stakeholders added successfully!",
      };
    } catch (error) {
      console.error("Error adding stakeholders:", error);
      return {
        success: false,
        message: "Oops, something went wrong. Please try again later.",
      };
    }
  });
