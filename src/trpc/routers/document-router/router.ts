import { createTRPCRouter } from "@/trpc/api/trpc";
import { createDocumentProcedure } from "./procedures/create-document";
import { getDocumentProcedure } from "./procedures/get-document";
import { getAllDocumentsProcedure } from "./procedures/get-all-documents";

export const documentRouter = createTRPCRouter({
  create: createDocumentProcedure,
  get: getDocumentProcedure,
  getAll: getAllDocumentsProcedure,
});
