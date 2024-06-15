import { PricingType } from "@/prisma/enums";
import { z } from "zod";

export const ZodCheckoutMutationSchema = z.object({
  priceId: z.string(),
  priceType: z.nativeEnum(PricingType),
});

export type TypeZodCheckoutMutationSchema = z.infer<
  typeof ZodCheckoutMutationSchema
>;

export const ZodStripePortalMutationSchema = z.object({
  type: z.enum(["cancel", "update"]),
  subscription: z.string(),
});

export type TypeZodStripePortalMutationSchema = z.infer<
  typeof ZodStripePortalMutationSchema
>;
