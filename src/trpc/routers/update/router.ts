import { createTRPCRouter } from "@/trpc/api/trpc";
import { deleteUpdateProcedure } from "./procedures/delete-update";
import { getRecipientsProcedure } from "./procedures/get-recipients";
import { getUpdatesProcedure } from "./procedures/get-updates";
import { saveUpdateProcedure } from "./procedures/save-update";
import { shareUpdateProcedure } from "./procedures/share-update";
import { toggleStatusProcedure } from "./procedures/toggle-status";

export const updateRouter = createTRPCRouter({
  get: getUpdatesProcedure,
  save: saveUpdateProcedure,
  share: shareUpdateProcedure,
  getRecipients: getRecipientsProcedure,
  delete: deleteUpdateProcedure,
  toggleStatus: toggleStatusProcedure,
});
