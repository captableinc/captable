import { z } from "zod";

export const ZodOnboardingUserMutationSchema = z.object({
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
});

export const ZodCompanyMutationSchema = z.object({
  company: z.object({
    name: z.string().min(1, {
      message: "Company name is required",
    }),
    website: z.string().min(1).optional(),
    incorporationType: z.string().min(1, {
      message: "Incorporation type is required",
    }),
    incorporationDate: z.date({
      required_error: "Incorporation date is required",
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
    country: z
      .string()
      .min(1, {
        message: "Country is required",
      })
      .default("US"),
    logo: z.string().min(1).optional(),
  }),
});

export const ZodOnboardingMutationSchema = ZodOnboardingUserMutationSchema.and(
  ZodCompanyMutationSchema,
);

export type TypeZodCompanyMutationSchema = z.infer<
  typeof ZodCompanyMutationSchema
>;

export type TypeZodOnboardingMutationSchema = z.infer<
  typeof ZodOnboardingMutationSchema
>;
