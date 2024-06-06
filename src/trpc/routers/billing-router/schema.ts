import { PricingType } from "@/prisma/enums";
import { z } from "zod";

export const ZodCheckoutMutationSchema = z.object({
  priceId: z.string(),
  priceType: z.nativeEnum(PricingType),
});

export type TypeZodCheckoutMutationSchema = z.infer<
  typeof ZodCheckoutMutationSchema
>;
