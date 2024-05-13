import { createTRPCRouter } from "@/trpc/api/trpc";
import { addOptionProcedure } from "./procedures/add-option";
import { deleteOptionProcedure } from "./procedures/delete-option";
import { getOptionsProcedure } from "./procedures/get-options";

export const securitiesRouter = createTRPCRouter({
  getOptions: getOptionsProcedure,
  addOptions: addOptionProcedure,
  deleteOption: deleteOptionProcedure,
});
