import { withAuth } from "@/trpc/api/trpc";
import { ZodAddStakeholdersMutationSchema } from "../schema";

export const addStakeholdersProcedure = withAuth
  .input(ZodAddStakeholdersMutationSchema)
  .mutation(async () => {
    return {};
  });
