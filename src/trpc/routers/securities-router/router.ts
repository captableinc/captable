import { createTRPCRouter } from "@/trpc/api/trpc";
import { addOptionProcedure } from "./procedures/add-option";
import { addShareProcedure } from "./procedures/add-share";
import { deleteOptionProcedure } from "./procedures/delete-option";
import { deleteShareProcedure } from "./procedures/delete-share";
import { getOptionsProcedure } from "./procedures/get-options";
import { getSharesProcedure } from "./procedures/get-shares";
import { updateShareProcedure } from "./procedures/update-share";

export const securitiesRouter = createTRPCRouter({
  getOptions: getOptionsProcedure,
  addOptions: addOptionProcedure,
  deleteOption: deleteOptionProcedure,
  getShares: getSharesProcedure,
  addShares: addShareProcedure,
  updateShares: updateShareProcedure,
  deleteShare: deleteShareProcedure,
});
