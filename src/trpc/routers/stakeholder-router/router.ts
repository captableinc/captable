import { createTRPCRouter } from "@/trpc/api/trpc";

import { addStakeholdersProcedure } from "./procedures/add-stakeholders";

export const stakeholderRouter = createTRPCRouter({
  addStakeholders: addStakeholdersProcedure,
});
