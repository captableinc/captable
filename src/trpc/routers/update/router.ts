import { createTRPCRouter } from "@/trpc/api/trpc";
import { saveUpdateProcedure } from "./procedures/save-update";
import { shareUpdateProcedure } from "./procedures/share-update";

export const updateRouter = createTRPCRouter({
  save: saveUpdateProcedure,
  share: shareUpdateProcedure,
});
