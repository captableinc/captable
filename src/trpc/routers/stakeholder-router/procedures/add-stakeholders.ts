import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { ZodAddStakeholderArrayMutationSchema } from "../schema";

export const addStakeholdersProcedure = withAuth
  .input(ZodAddStakeholderArrayMutationSchema)
  .mutation(async ({ ctx: { db, session }, input }) => {
    try {
      await db.$transaction(async (tx) => {
        const { companyId } = await checkMembership({ session, tx });

        // insert companyId in every input
        const inputDataWithCompanyId = input.map((stakeholder) => ({
          ...stakeholder,
          companyId,
        }));

        await tx.stakeholder.createMany({
          data: inputDataWithCompanyId,
          skipDuplicates: true,
        });
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
