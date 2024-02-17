import { createTRPCRouter } from "@/trpc/api/trpc";
import { createTemplateProcedure } from "./procedures/create-template";
import { getTemplateProcedure } from "./procedures/get-template";
import { addFieldProcedure } from "./procedures/add-fields";

export const templateRouter = createTRPCRouter({
  create: createTemplateProcedure,
  get: getTemplateProcedure,
  addField: addFieldProcedure,
});
