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
    conversionCap: z.number().nullish(),
    discountRate: z.number().nullish(),
    mfn: z.boolean().nullish(),
    additionalTerms: z.string().nullish(),
    interestRate: z.number().nullish(),
    stakeholderId: z.string(),
    companyId: z.string(),
    issueDate: z.string().date(),
    boardApprovalDate: z.string().date(),

    status: z.nativeEnum(ConvertibleStatusEnum),
    type: z.nativeEnum(ConvertibleTypeEnum),
    interestMethod: z.nativeEnum(ConvertibleInterestMethodEnum).nullish(),
    interestAccrual: z.nativeEnum(ConvertibleInterestAccrualEnum).nullish(),
    interestPaymentSchedule: z
      .nativeEnum(ConvertibleInterestPaymentScheduleEnum)
      .nullish(),

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
  status: true,
});

export type TCreateConvertibleNotesSchema = z.infer<
  typeof CreateConvertibleNotesSchema
>;
