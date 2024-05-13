import { createTRPCRouter } from "@/trpc/api/trpc";

import { addFieldProcedure } from "./procedures/add-fields";

export const templateFieldRouter = createTRPCRouter({
  add: addFieldProcedure,
});
