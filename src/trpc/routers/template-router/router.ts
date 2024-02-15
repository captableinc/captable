import { createTRPCRouter } from "@/trpc/api/trpc";
import { createTemplateProcedure } from "./procedures/create-template";
import { getTemplateProcedure } from "./procedures/get-template";

export const templateRouter = createTRPCRouter({
  create: createTemplateProcedure,
  get: getTemplateProcedure,
});
