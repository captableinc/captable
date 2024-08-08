import { z } from "@hono/zod-openapi";
import { SafeStatusEnum, SafeTypeEnum } from "@prisma/client";

const types = z.nativeEnum(SafeTypeEnum);
const statuses = z.nativeEnum(SafeStatusEnum);

export const ApiSafeSchema = z.object({
  id: z.string().cuid().openapi({
    description: "SAFE ID",
    example: "cly402ncj0000i7ng9l0v04qr",
  }),
  externalId: z.string().optional().openapi({
    description: "External ID of the safe",
    example: "1234567890",
  }),
  type: types.openapi({
    description: "Type of the safe",
    example: "POST_MONEY",
  }),
  status: statuses.openapi({
    description: "Status of the safe",
    example: "ACTIVE",
  }),
  capital: z.number().openapi({
    description: "SAFE investment capital",
    example: 10000,
  }),
  valuationCap: z.number().optional().openapi({
    description: "Valuation cap of the safe",
    example: 100000000,
  }),
  discountRate: z.number().optional().openapi({
    description: "Discount rate in percentage",
    example: 5,
  }),
  mfn: z.boolean().optional().openapi({
    description: "Most favoured nation",
    example: true,
  }),
  proRata: z.boolean().optional().openapi({
    description: "Pro rata rights",
    example: true,
  }),
  stakeholderId: z.string().cuid().openapi({
    description: "Stakeholder / Investor ID",
    example: "clzkv7w5c0000f1ngf3yq2s45",
  }),
  documents: z
    .array(z.string().url())
    .optional()
    .openapi({
      description: "Secure links to SAFE documents",
      example: [
        "https://docs.captable.inc/document1.pdf",
        "https://docs.captable.inc/document2.pdf",
      ],
    }),
  companyId: z.string().cuid().openapi({
    description: "Company ID",
    example: "clzkvdnhj0000f1ngf3fxakwu",
  }),
  issueDate: z.date().optional().openapi({
    description: "Date of issue",
    example: "2021-01-01",
  }),
  boardApprovalDate: z.date().optional().openapi({
    description: "Date of board approval",
    example: "2021-01-01",
  }),
  createdAt: z.date().openapi({
    description: "Created at timestamp",
    example: "2021-01-01",
  }),
});

export type ApiSafeType = z.infer<typeof ApiSafeSchema>;
