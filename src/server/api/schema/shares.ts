import { z } from "@hono/zod-openapi";
import {
  SecuritiesStatusEnum,
  ShareLegendsEnum,
  VestingScheduleEnum,
} from "@prisma/client";

const VestingScheduleArr = Object.values(VestingScheduleEnum) as [
  string,
  ...string[],
];
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
    id: z.string().cuid().openapi({
      description: "Share ID",
      example: "cly13ipa40000i7ng42mv4x7b",
    }),

    status: z.enum(SecuritiesStatusArr).openapi({
      description: "Security Status",
      example: "DRAFT",
    }),

    certificateId: z.string().cuid().openapi({
      description: "Certificate ID",
      example: "cly13ipa40000i7ng42mv4x7b",
    }),

    quantity: z.number().openapi({
      description: "Quantity of Shares",
      example: 234,
    }),

    pricePerShare: z.number().nullable().openapi({
      description: "Price Per Share",
      example: 23.4,
    }),

    capitalContribution: z.number().nullable().openapi({
      description: "Total amount of money contributed",
      example: 25.4,
    }),

    ipContribution: z.number().nullable().openapi({
      description: "Value of the intellectual property contributed",
      example: 43.4,
    }),

    debtCancelled: z.number().nullable().openapi({
      description: "Amount of debt cancelled",
      example: 54.54,
    }),

    otherContributions: z.number().nullable().openapi({
      description: "Other contributions",
      example: 45.54,
    }),

    vestingSchedule: z.enum(VestingScheduleArr).openapi({
      description: "Vesting Schedule",
      example: "VESTING_0_0_0",
    }),

    companyLegends: z
      .enum(ShareLegendsArr)
      .array()
      .openapi({
        description: "Company Legends",
        example: ["US_SECURITIES_ACT", "SALE_AND_ROFR"],
      }),

    issueDate: z.string().datetime().openapi({
      description: "Issued Date",
      example: "1970-01-01T00:00:00.000Z",
    }),

    rule144Date: z.string().datetime().nullable().openapi({
      description: "Rule 144 Date",
      example: "1970-01-01T00:00:00.000Z",
    }),

    vestingStartDate: z.string().datetime().nullable().openapi({
      description: "Vesting Start Date",
      example: "1970-01-01T00:00:00.000Z",
    }),

    boardApprovalDate: z.string().datetime().optional().openapi({
      description: "Board Approval Date",
      example: "1970-01-01T00:00:00.000Z",
    }),

    stakeholderId: z.string().cuid().openapi({
      description: "StakeHolder ID",
      example: "cly13ipa40000i7ng42mv4x7b",
    }),

    companyId: z.string().cuid().openapi({
      description: "Company ID",
      example: "cly13ipa40000i7ng42mv4x7b",
    }),

    shareClassId: z.string().cuid().openapi({
      description: "ShareClass ID",
      example: "cly13ipa40000i7ng42mv4x7b",
    }),

    createdAt: z.string().datetime().optional().openapi({
      description: "Share Created at",
      example: "1970-01-01T00:00:00.000Z",
    }),

    updatedAt: z.string().datetime().optional().openapi({
      description: "Share Updated at",
      example: "1970-01-01T00:00:00.000Z",
    }),
  })
  .openapi({
    description: "Get a Single Share by the ID",
  });

export type TShareSchema = z.infer<typeof ShareSchema>;
