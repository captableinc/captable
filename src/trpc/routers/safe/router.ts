import { createTRPCRouter } from "@/trpc/api/trpc";
import { createSafeProcedure } from "./procedures/create-safe";
import { getSafesProcedure } from "./procedures/get-safes";
import { deleteSafeProcedure } from "./procedures/delete-safe";
import { addExistingSafeProcedure } from "./procedures/add-existing-safe";

export const safeRouter = createTRPCRouter({
  getSafes: getSafesProcedure,
  create: createSafeProcedure,
  addExisting: addExistingSafeProcedure,
  deleteSafe: deleteSafeProcedure,
});
