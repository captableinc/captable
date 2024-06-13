import { createTRPCRouter } from "@/trpc/api/trpc";
import { cloneUpdateProcedure } from "./procedures/clone-update";
import {
  getRecipientsProcedure,
  getUpdatesProcedure,
} from "./procedures/get-updates";
import { saveUpdateProcedure } from "./procedures/save-update";
import {
  shareUpdateProcedure,
  unshareUpdateProcedure,
} from "./procedures/share-update";
import { toggleUpdateVisibilityProcedure } from "./procedures/toggle-update-visibility";

export const updateRouter = createTRPCRouter({
  save: saveUpdateProcedure,
  get: getUpdatesProcedure,
  getRecipients: getRecipientsProcedure,
  clone: cloneUpdateProcedure,
  share: shareUpdateProcedure,
  unShare: unshareUpdateProcedure,
  toggleVisibility: toggleUpdateVisibilityProcedure,
});
