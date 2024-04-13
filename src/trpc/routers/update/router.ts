import { createTRPCRouter } from "@/trpc/api/trpc";
import { getUpdatesProcedure } from "./procedures/get-updates";
import { saveUpdatesProcedure } from "./procedures/save-updates";
export const updateRouter = createTRPCRouter({
  save: saveUpdatesProcedure,
  get: getUpdatesProcedure,
});
