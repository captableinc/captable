import { createTRPCRouter } from "@/trpc/api/trpc";
import { getProductsProcedure } from "./procedures/get-products";
import { getSubscriptionProcedure } from "./procedures/get-subscription";

export const billingRouter = createTRPCRouter({
  getProducts: getProductsProcedure,
  getSubscription: getSubscriptionProcedure,
});
