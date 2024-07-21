import { z } from "@hono/zod-openapi";
import {
  SecuritiesStatusEnum,
  ShareLegendsEnum,
} from "@prisma/client";
import { Share } from "next/font/google";

const ShareLegendsArr = Object.values(ShareLegendsEnum) as [
  string,
  ...string[],
];
const SecuritiesStatusArr = Object.values(SecuritiesStatusEnum) as [
  string,
  ...string[],
];

export const ShareSchema = z
  .object({
    id: z.string().cuid().nullish().openapi({
      description: "Share ID",
      example: "clyvb2s8d0000f1ngd72y2cxw",
    }),

    status: z.enum(SecuritiesStatusArr).openapi({
      description: "Security Status",
      example: "DRAFT",
    }),

    certificateId: z.string().nullish().openapi({
      description: "Certificate ID",
      example: "123",
    }),

    quantity: z.number().openapi({
      description: "Quantity of Shares",
      example: 5000,
    }),

    pricePerShare: z.number().nullish().openapi({
      description: "Price Per Share",
      example: 1.25,
    }),

    capitalContribution: z.number().nullish().openapi({
      description: "Total amount of money contributed",
      example: 250000,
    }),

    ipContribution: z.number().nullish().openapi({
      description: "Value of the intellectual property contributed",
      example: 0,
    }),

    debtCancelled: z.number().nullish().openapi({
      description: "Amount of debt cancelled",
      example: 0,
    }),

    otherContributions: z.number().nullish().openapi({
      description: "Other contributions",
      example: 0,
    }),

    cliffYears: z.number().nullish().openapi({
      description: "Cliff Years",
      example: 1,
    }),

    vestingYears: z.number().nullish().openapi({
      description: "Vesting Years",
      example: 4,
    }),

    companyLegends: z
      .enum(ShareLegendsArr)
      .array()
      .default([])
      .nullish()
      .openapi({
        description: "Company Legends",
        example: ["US_SECURITIES_ACT", "SALE_AND_ROFR"],
      }),

    issueDate: z.string().datetime().nullish().openapi({
      description: "Issued Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    rule144Date: z.string().datetime().nullish().openapi({
      description: "Rule 144 Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    vestingStartDate: z.string().datetime().nullish().openapi({
      description: "Vesting Start Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    boardApprovalDate: z.string().datetime().nullish().openapi({
      description: "Board Approval Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    stakeholderId: z.string().cuid().openapi({
      description: "StakeHolder ID",
      example: "cly13ipa40000i7ng42mv4x7b",
    }),

    companyId: z.string().cuid().openapi({
      description: "Company ID",
      example: "clyvb28ak0000f1ngcn2i0p2m",
    }),

    shareClassId: z.string().cuid().openapi({
      description: "ShareClass ID",
      example: "clyvb2d8v0000f1ng1stpa38s",
    }),

    createdAt: z.string().datetime().nullish().openapi({
      description: "Share Created at",
      example: "2024-01-01T00:00:00.000Z",
    }),

    updatedAt: z.string().datetime().nullish().openapi({
      description: "Share Updated at",
      example: "2024-01-01T00:00:00.000Z",
    }),
  })
  .openapi({
    description: "Get a Single Share by the ID",
  });

export const CreateShareSchema = ShareSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
}).openapi({
  description: "Issue shares to a stakeholder in a company.",
});

export const UpdateShareSchema = ShareSchema.omit({
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
    description: "Update a share by ID",
  });

export type ShareSchemaType = z.infer<typeof ShareSchema>;
export type CreateShareSchemaType = z.infer<typeof CreateShareSchema>;
export type UpdateShareSchemaType = z.infer<typeof UpdateShareSchema>;
