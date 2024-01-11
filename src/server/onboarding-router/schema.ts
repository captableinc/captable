import { z } from "zod";

export const ZOnboardMutationSchema = z.object({
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
    companyName: z.string(),
    title: z.string(),
  }),

  company: z.object({
    incorporation: z.object({
      type: z.string(),
      date: z.string(),
      country: z.string(),
      state: z.string(),
    }),

    address: z.object({
      streetAddress: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    }),
  }),
});

export type TOnboardMutationSchema = z.infer<typeof ZOnboardMutationSchema>;
