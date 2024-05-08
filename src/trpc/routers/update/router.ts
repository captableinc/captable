import { createTRPCRouter } from "@/trpc/api/trpc";
import { cloneUpdateProcedure } from "./procedures/clone-update";
import { getUpdatesProcedure } from "./procedures/get-updates";
import { saveUpdateProcedure } from "./procedures/save-update";
import { shareUpdateProcedure } from "./procedures/share-update";

export const updateRouter = createTRPCRouter({
  save: saveUpdateProcedure,
  get: getUpdatesProcedure,
  clone: cloneUpdateProcedure,
  share: shareUpdateProcedure,
  // unShare: unshareUpdateProcedure,
});
