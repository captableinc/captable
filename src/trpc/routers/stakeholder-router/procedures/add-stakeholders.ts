import { withAuth } from "@/trpc/api/trpc";
import { ZodAddStakeholderArrayMutationSchema } from "../schema";

export const addStakeholdersProcedure = withAuth
  .input(ZodAddStakeholderArrayMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const companyId = ctx.session.user.companyId;

    // insert companyId in every input
    const inputDataWithCompanyId = input.map((stakeholder) => ({
      ...stakeholder,
      companyId,
    }));

    // get existing stakeholders
    const existingStakeholders = await ctx.db.stakeholder.findMany({
      where: {
        companyId,
      },
      select: {
        email: true,
      },
    });

    // filter out stakeholders who are already in the company
    const uniqueStakeholders = inputDataWithCompanyId.filter((stakeholder) => {
      return !existingStakeholders.some(
        (existingStakeholder) =>
          existingStakeholder.email === stakeholder.email,
      );
    });

    // bulk create
    if (uniqueStakeholders.length > 0) {
      await ctx.db.stakeholder.createMany({
        data: uniqueStakeholders,
        skipDuplicates: true,
      });
    }

    return {
      success: true,
      message: "Stakeholders added successfully!",
    };
  });
