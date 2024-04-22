import { createTRPCRouter } from "@/trpc/api/trpc";
import { createDocumentShareProcedure } from "./procedures/create-document-share";

export const documentShareRouter = createTRPCRouter({
  create: createDocumentShareProcedure,
});
