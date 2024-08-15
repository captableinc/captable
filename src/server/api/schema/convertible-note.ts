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
    id: z.string().cuid().openapi({
      description: "Convertible note ID",
      example: "clyvb2s8d0000f1ngd72y2cxw",
    }),
    publicId: z.string().openapi({
      description: "Public identifier of the convertible note",
      example: "public-note-1234",
    }),
    capital: z.number().openapi({
      description: "Capital amount in the convertible note",
      example: 100000,
    }),
    conversionCap: z.number().nullish().openapi({
      description: "Conversion cap amount",
      example: 150000,
    }),
    discountRate: z.number().nullish().openapi({
      description: "Discount rate applied to the convertible note",
      example: 0.2,
    }),
    mfn: z.boolean().nullish().openapi({
      description: "Most-favored nation (MFN) clause",
      example: true,
    }),
    additionalTerms: z.string().nullish().openapi({
      description: "Any additional terms for the convertible note",
      example: "Additional terms here",
    }),
    interestRate: z.number().nullish().openapi({
      description: "Interest rate on the convertible note",
      example: 0.05,
    }),
    stakeholderId: z.string().openapi({
      description: "ID of the stakeholder associated with the note",
      example: "stakeholder-5678",
    }),
    companyId: z.string().openapi({
      description: "ID of the company issuing the note",
      example: "company-9876",
    }),
    issueDate: z.string().datetime().openapi({
      description: "Date when the convertible note was issued",
      example: "2024-01-01T00:00:00Z",
    }),
    boardApprovalDate: z.string().datetime().openapi({
      description: "Date when the board approved the convertible note",
      example: "2024-01-15T00:00:00Z",
    }),
    status: z.nativeEnum(ConvertibleStatusEnum).openapi({
      description: "Status of the convertible note",
      example: ConvertibleStatusEnum.ACTIVE,
    }),
    type: z.nativeEnum(ConvertibleTypeEnum).openapi({
      description: "Type of convertible note",
      example: ConvertibleTypeEnum.NOTE,
    }),
    interestMethod: z
      .nativeEnum(ConvertibleInterestMethodEnum)
      .nullish()
      .openapi({
        description: "Method of calculating interest",
        example: ConvertibleInterestMethodEnum.SIMPLE,
      }),
    interestAccrual: z
      .nativeEnum(ConvertibleInterestAccrualEnum)
      .nullish()
      .openapi({
        description: "Interest accrual method",
        example: ConvertibleInterestAccrualEnum.MONTHLY,
      }),
    interestPaymentSchedule: z
      .nativeEnum(ConvertibleInterestPaymentScheduleEnum)
      .nullish()
      .openapi({
        description: "Schedule for interest payments",
        example: ConvertibleInterestPaymentScheduleEnum.DEFERRED,
      }),
    createdAt: z.string().datetime().openapi({
      description: "Timestamp of when the note was created",
      example: "2024-01-01T12:00:00Z",
    }),
    updatedAt: z.string().datetime().openapi({
      description: "Timestamp of the last update to the note",
      example: "2024-02-01T12:00:00Z",
    }),
  })
  .openapi("Convertible Note", {
    description: "Schema for a convertible note",
  });

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

export const ConvertibleNoteSchemaWithStakeHolder = z
  .object({
    stakeholder: z.object({
      name: z.string().openapi({
        description: "Name of the stakeholder",
        example: "John Doe",
      }),
    }),
  })
  .merge(ConvertibleNoteSchema);
