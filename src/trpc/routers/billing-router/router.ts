import { createTRPCRouter } from "@/trpc/api/trpc";
import { getProductsProcedure } from "./procedures/get-products";

export const billingRouter = createTRPCRouter({
  getProducts: getProductsProcedure,
});
