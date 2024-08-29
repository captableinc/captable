import {
  StakeholderRelationshipEnum,
  StakeholderTypeEnum,
} from "@/prisma/enums";
import { z } from "@hono/zod-openapi";

export const StakeholderSchema = z
  .object({
    id: z.string().cuid().openapi({
      description: "Stakeholder ID",
      example: "cly13ipa40000i7ng42mv4x7b",
    }),

    name: z.string().openapi({
      description: "Stakeholder name",
      example: "John Doe",
    }),

    email: z.string().email().openapi({
      description: "Stakeholder email",
      example: "email@example.com",
    }),

    institutionName: z.string().nullish().openapi({
      description: "Institution name",
      example: "ACME Corp",
    }),

    stakeholderType: z.nativeEnum(StakeholderTypeEnum).openapi({
      description: "Stakeholder type",
      example: "INDIVIDUAL",
    }),

    currentRelationship: z.nativeEnum(StakeholderRelationshipEnum).openapi({
      description: "Current relationship with the company",
      example: "EMPLOYEE",
    }),

    streetAddress: z.string().nullish().openapi({
      description: "Street address",
      example: "123 Main St",
    }),

    city: z.string().nullish().openapi({
      description: "City",
      example: "San Francisco",
    }),

    state: z.string().nullish().openapi({
      description: "State",
      example: "CA",
    }),

    zipcode: z.string().nullish().openapi({
      description: "Zip code",
      example: "94105",
    }),

    country: z.string().optional().openapi({
      description: "Country",
      example: "USA",
    }),

    createdAt: z.string().date().openapi({
      description: "Date the stakeholder was created",
      example: "2022-01-01T00:00:00Z",
    }),

    updatedAt: z.string().date().openapi({
      description: "Date the stakeholder was last updated",
      example: "2022-01-01T00:00:00Z",
    }),
  })
  .openapi("Stakeholder");

export const CreateStakeholderSchema = z.array(
  StakeholderSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
);
export const UpdateStakeholderSchema = StakeholderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .refine(
    (data) => {
      return Object.values(data).some((value) => value !== undefined);
    },
    {
      message: "At least one field must be provided to update.",
    },
  )
  .openapi({
    description: "Update a stakeholder by ID",
  });

export type TStakeholderSchema = z.infer<typeof StakeholderSchema>;
export type TCreateStakeholderSchema = z.infer<typeof CreateStakeholderSchema>;
export type TUpdateStakeholderSchema = z.infer<typeof UpdateStakeholderSchema>;
