import { createTRPCRouter } from "@/trpc/api/trpc";
import { addOptionProcedure } from "./procedures/add-option";
import { getOptionsProcedure } from "./procedures/get-options";
import { deleteOptionProcedure } from "./procedures/delete-option";

export const securitiesRouter = createTRPCRouter({
  getOptions: getOptionsProcedure,
  addOptions: addOptionProcedure,
  deleteOption: deleteOptionProcedure,
});
