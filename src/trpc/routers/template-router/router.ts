import { createTRPCRouter } from "@/trpc/api/trpc";
import { createTemplateProcedure } from "./procedures/create-template";

export const templateRouter = createTRPCRouter({
  create: createTemplateProcedure,
});
