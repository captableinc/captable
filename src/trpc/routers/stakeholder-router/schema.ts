import { z } from "zod";

const StakeholderTypeEnum = z.enum(["INDIVIDUAL", "INSTITUTION"]);

const StakeholderRelationshipEnum = z.enum([
  "ADVISOR",
  "BOARD_MEMBER",
  "CONSULTANT",
  "EMPLOYEE",
  "EX_ADVISOR",
  "EX_CONSULTANT",
  "EX_EMPLOYEE",
  "EXECUTIVE",
  "FOUNDER",
  "INVESTOR",
  "NON_US_EMPLOYEE",
  "OFFICER",
  "OTHER",
]);

export const ZodCreateStakeholderMutationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  institutionName: z.string().min(1).optional(),
  stakeholderType: StakeholderTypeEnum,
  currentRelationship: StakeholderRelationshipEnum,
  taxId: z.string().min(1).optional(),
  streetAddress: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zipcode: z.string().min(1).optional(),
});

export type TypeZodCreateStakeholderMutationSchema = z.infer<
  typeof ZodCreateStakeholderMutationSchema
>;
