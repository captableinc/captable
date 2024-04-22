import { createTRPCRouter } from "@/trpc/api/trpc";
import { addShareClassProcedure } from "./procedures/add-share-class";
import { getShareClassProcedure } from "./procedures/get-share-class";
import { updateShareClassProcedure } from "./procedures/update-share-class";

export const shareClassRouter = createTRPCRouter({
  create: addShareClassProcedure,
  update: updateShareClassProcedure,
  get: getShareClassProcedure,
});
