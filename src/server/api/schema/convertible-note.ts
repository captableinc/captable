import {
  ConvertibleInterestAccrualEnum,
  ConvertibleInterestMethodEnum,
  ConvertibleInterestPaymentScheduleEnum,
  ConvertibleStatusEnum,
  ConvertibleTypeEnum,
} from "@/prisma/enums";
import { z } from "@hono/zod-openapi";

const ConvertibleStatus = Object.values(ConvertibleStatusEnum) as [
  ConvertibleStatusEnum,
  ...ConvertibleStatusEnum[],
];

const ConvertibleType = Object.values(ConvertibleTypeEnum) as [
  ConvertibleTypeEnum,
  ...ConvertibleTypeEnum[],
];

const ConvertibleInterestMethod = Object.values(
  ConvertibleInterestMethodEnum,
) as [ConvertibleInterestMethodEnum, ...ConvertibleInterestMethodEnum[]];

const ConvertibleInterestPaymentSchedule = Object.values(
  ConvertibleInterestPaymentScheduleEnum,
) as [
  ConvertibleInterestPaymentScheduleEnum,
  ...ConvertibleInterestPaymentScheduleEnum[],
];

const ConvertibleInterestAccrual = Object.values(
  ConvertibleInterestAccrualEnum,
) as [ConvertibleInterestAccrualEnum, ...ConvertibleInterestAccrualEnum[]];

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
    issueDate: z.coerce.date(),
    boardApprovalDate: z.coerce.date(),

    status: z.enum(ConvertibleStatus),
    type: z.enum(ConvertibleType),
    interestMethod: z.enum(ConvertibleInterestMethod).nullable(),
    interestAccrual: z.enum(ConvertibleInterestPaymentSchedule).nullable(),
    interestPaymentSchedule: z.enum(ConvertibleInterestAccrual).nullable(),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .openapi("Convertible Note");

export type TConvertibleNoteSchema = z.infer<typeof ConvertibleNoteSchema>;
