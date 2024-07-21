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
    id: z.string().cuid().optional().openapi({
      description: "Share ID",
      example: "clyvb2s8d0000f1ngd72y2cxw",
    }),

    status: z.enum(SecuritiesStatusArr).openapi({
      description: "Security Status",
      example: "DRAFT",
    }),

    certificateId: z.string().optional().openapi({
      description: "Certificate ID",
      example: "123",
    }),

    quantity: z.number().openapi({
      description: "Quantity of Shares",
      example: 5000,
    }),

    pricePerShare: z.number().nullable().openapi({
      description: "Price Per Share",
      example: 1.25,
    }),

    capitalContribution: z.number().nullable().openapi({
      description: "Total amount of money contributed",
      example: 250000,
    }),

    ipContribution: z.number().nullable().openapi({
      description: "Value of the intellectual property contributed",
      example: 0,
    }),

    debtCancelled: z.number().nullable().openapi({
      description: "Amount of debt cancelled",
      example: 0,
    }),

    otherContributions: z.number().nullable().openapi({
      description: "Other contributions",
      example: 0,
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
      example: "2024-01-01T00:00:00.000Z",
    }),

    rule144Date: z.string().datetime().nullable().openapi({
      description: "Rule 144 Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    vestingStartDate: z.string().datetime().nullable().openapi({
      description: "Vesting Start Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    boardApprovalDate: z.string().datetime().optional().openapi({
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

    createdAt: z.string().datetime().optional().openapi({
      description: "Share Created at",
      example: "2024-01-01T00:00:00.000Z",
    }),

    updatedAt: z.string().datetime().optional().openapi({
      description: "Share Updated at",
      example: "2024-01-01T00:00:00.000Z",
    }),
  })
  .openapi({
    description: "Get a Single Share by the ID",
  });

export const AddShareSchema = z
  .object({
    status: z.enum(SecuritiesStatusArr).openapi({
      description: "Security Status",
      example: "DRAFT",
    }),

    certificateId: z.string().openapi({
      description: "Certificate ID",
      example: "cly13ipa40000i7ng42mv4x7b",
    }),

    quantity: z.number().min(0).openapi({
      description: "Quantity of Shares",
      example: 234,
    }),

    pricePerShare: z.number().min(0).openapi({
      description: "Price Per Share",
      example: 23.4,
    }),

    capitalContribution: z.number().min(0).openapi({
      description: "Total amount of money contributed",
      example: 25.4,
    }),

    ipContribution: z.number().min(0).openapi({
      description: "Value of the intellectual property contributed",
      example: 43.4,
    }),

    debtCancelled: z.number().min(0).openapi({
      description: "Amount of debt cancelled",
      example: 54.54,
    }),

    otherContributions: z.number().min(0).openapi({
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
      example: "2024-01-01T00:00:00.000Z",
    }),

    rule144Date: z.string().datetime().openapi({
      description: "Rule 144 Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    vestingStartDate: z.string().datetime().openapi({
      description: "Vesting Start Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    boardApprovalDate: z.string().datetime().openapi({
      description: "Board Approval Date",
      example: "2024-01-01T00:00:00.000Z",
    }),

    stakeholderId: z.string().cuid().openapi({
      description: "StakeHolder ID",
      example: "clydxglyl0000d94ff363egje",
    }),

    shareClassId: z.string().cuid().openapi({
      description: "ShareClass ID",
      example: "clycjzdqo000cjvsqr9rn6479",
    }),

    // documents: z
    //   .array(
    //     z.object({
    //       bucketId: z.string(),
    //       name: z.string(),
    //     }),
    //   )
    //   .openapi({
    //     description: "Uploaded Documents",
    //     example: [{ bucketId: "vbhjewhvjvj3", name: "Bucket Blue" }],
    //   }),
  })
  .openapi({
    description: "Create a Share",
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
export type AddShareSchemaType = z.infer<typeof AddShareSchema>;
export type UpdateShareSchemaType = z.infer<typeof UpdateShareSchema>;
