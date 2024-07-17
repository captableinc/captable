import {
  StakeholderRelationshipEnum,
  StakeholderTypeEnum,
} from "@prisma/client";
import { z } from "zod";

const StakeholderTypeArray = Object.values(StakeholderTypeEnum) as [
  StakeholderTypeEnum,
  ...StakeholderTypeEnum[],
];
const StakeholderRelationshipArray = Object.values(
  StakeholderRelationshipEnum,
) as [StakeholderRelationshipEnum, ...StakeholderRelationshipEnum[]];

export const StakeholderSchema = z.object({
  id: z.string().cuid().optional().openapi({
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

  institutionName: z.string().optional().openapi({
    description: "Institution name",
    example: "ACME Corp",
  }),

  stakeholderType: z.enum(StakeholderTypeArray).openapi({
    description: "Stakeholder type",
    example: "INDIVIDUAL",
  }),

  currentRelationship: z.enum(StakeholderRelationshipArray).openapi({
    description: "Current relationship with the company",
    example: "EMPLOYEE",
  }),

  streetAddress: z.string().optional().openapi({
    description: "Street address",
    example: "123 Main St",
  }),

  city: z.string().optional().openapi({
    description: "City",
    example: "San Francisco",
  }),

  state: z.string().optional().openapi({
    description: "State",
    example: "CA",
  }),

  zipcode: z.string().optional().openapi({
    description: "Zip code",
    example: "94105",
  }),

  country: z.string().optional().openapi({
    description: "Country",
    example: "USA",
  }),

  createdAt: z.string().date().optional().openapi({
    description: "Date the stakeholder was created",
    example: "2022-01-01T00:00:00Z",
  }),

  updatedAt: z.string().date().optional().openapi({
    description: "Date the stakeholder was last updated",
    example: "2022-01-01T00:00:00Z",
  }),
});

export const AddStakeholderSchema = z.array(StakeholderSchema);

export const UpdateStakeholderSchema = StakeholderSchema.partial();

export type TStakeholderSchema = z.infer<typeof StakeholderSchema>;
export type TAddStakeholderSchema = z.infer<typeof AddStakeholderSchema>;
export type TUpdateStakeholderSchema = z.infer<typeof UpdateStakeholderSchema>;
