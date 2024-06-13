import { createTRPCRouter } from "@/trpc/api/trpc";
import { checkoutProcedure } from "./procedures/checkout";
import { getProductsProcedure } from "./procedures/get-products";
import { getSubscriptionProcedure } from "./procedures/get-subscription";
import { stripePortalProcedure } from "./procedures/stripe-portal";

export const billingRouter = createTRPCRouter({
  getProducts: getProductsProcedure,
  getSubscription: getSubscriptionProcedure,
  checkout: checkoutProcedure,
  stripePortal: stripePortalProcedure,
});
