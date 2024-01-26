import { z } from "zod";

export const ZodOnboardingMutationSchema = z.object({
  user: z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email().min(1, {
      message: "Email is required",
    }),
    title: z
      .string()
      .min(1, {
        message: "Title is required",
      })
      .optional(),
  }),
  company: z.object({
    name: z.string().min(1, {
      message: "Company name is required",
    }),
    incorporationType: z.string().min(1, {
      message: "Incorporation type is required",
    }),
    incorporationDate: z.string().min(1, {
      message: "Incorporation date is required",
    }),
    incorporationCountry: z.string().min(1, {
      message: "Incorporation country is required",
    }),
    incorporationState: z.string().min(1, {
      message: "Incorporation state is required",
    }),
    streetAddress: z.string().min(1, {
      message: "Street address is required",
    }),
    city: z.string().min(1, {
      message: "City is required",
    }),
    state: z.string().min(1, {
      message: "State is required",
    }),
    zipcode: z.string().min(1, {
      message: "Zipcode is required",
    }),
  }),
});

export type TypeZodOnboardingMutationSchema = z.infer<
  typeof ZodOnboardingMutationSchema
>;
