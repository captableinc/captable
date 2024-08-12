import {
  ConvertibleInterestAccrualEnum,
  ConvertibleInterestMethodEnum,
  ConvertibleInterestPaymentScheduleEnum,
  ConvertibleStatusEnum,
  ConvertibleTypeEnum,
} from "@/prisma/enums";
import { z } from "@hono/zod-openapi";

export const ConvertibleNoteSchema = z
  .object({
    id: z.string().cuid(),
    publicId: z.string(),
    capital: z.number(),
    conversionCap: z.number().nullable(),
    discountRate: z.number().nullable(),
    mfn: z.boolean().nullable(),
    additionalTerms: z.string().nullable(),
    interestRate: z.number().nullable(),
    stakeholderId: z.string(),
    companyId: z.string(),
    issueDate: z.string().date(),
    boardApprovalDate: z.string().date(),

    status: z.nativeEnum(ConvertibleStatusEnum),
    type: z.nativeEnum(ConvertibleTypeEnum),
    interestMethod: z.nativeEnum(ConvertibleInterestMethodEnum).nullable(),
    interestAccrual: z.nativeEnum(ConvertibleInterestAccrualEnum).nullable(),
    interestPaymentSchedule: z
      .nativeEnum(ConvertibleInterestPaymentScheduleEnum)
      .nullable(),

    createdAt: z.string().date(),
    updatedAt: z.string().date(),
  })
  .openapi("Convertible Note");

export type TConvertibleNoteSchema = z.infer<typeof ConvertibleNoteSchema>;

export const CreateConvertibleNotesSchema = ConvertibleNoteSchema.omit({
  id: true,
  publicId: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

export type TCreateConvertibleNotesSchema = z.infer<
  typeof CreateConvertibleNotesSchema
>;
