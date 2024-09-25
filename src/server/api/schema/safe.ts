import { z } from "@hono/zod-openapi";
import { SafeStatusEnum, SafeTypeEnum } from "@prisma/client";

const types = z.nativeEnum(SafeTypeEnum);
const statuses = z.nativeEnum(SafeStatusEnum);

export const SafeSchema = z
  .object({
    id: z.string().cuid().openapi({
      description: "SAFE ID",
      example: "cly402ncj0000i7ng9l0v04qr",
    }),
    publicId: z.string().openapi({
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
    valuationCap: z.number().nullish().openapi({
      description: "Valuation cap of the safe",
      example: 100000000,
    }),
    discountRate: z.number().nullish().openapi({
      description: "Discount rate in percentage",
      example: 5,
    }),
    mfn: z.boolean().openapi({
      description: "Most favoured nation",
      example: false,
    }),
    proRata: z.boolean().openapi({
      description: "Pro rata rights",
      example: false,
    }),
    signerStakeholderId: z.string().cuid().openapi({
      description: "Stakeholder / Investor ID",
      example: "clzkv7w5c0000f1ngf3yq2s45",
    }),
    signerMemberId: z.string().cuid().openapi({
      description: "Signer ID",
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
    bankAccountId: z.string().cuid().optional().openapi({
      description: "Bank account ID to receive funds",
      example: "clzkv7w5c0000f1ngf3yq2s45",
    }),
    issueDate: z.string().date().openapi({
      description: "Date of issue",
      example: "2021-01-01",
    }),
    boardApprovalDate: z.string().date().nullish().openapi({
      description: "Date of board approval",
      example: "2021-01-01",
    }),

    createdAt: z.string().date().openapi({
      description: "Date the Safe was created",
      example: "2022-01-01T00:00:00Z",
    }),

    updatedAt: z.string().date().openapi({
      description: "Date the Safe was last updated",
      example: "2022-01-01T00:00:00Z",
    }),
  })
  .openapi("SAFE");

export type TSafeSchema = z.infer<typeof SafeSchema>;

export const CreateSafeSchema = SafeSchema.omit({
  createdAt: true,
  documents: true,
  id: true,
  publicId: true,
  companyId: true,
});
