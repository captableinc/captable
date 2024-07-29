import { OptionStatusEnum, OptionTypeEnum } from "@/prisma/enums";
import { z } from "zod";

const OptionTypeArray = Object.values(OptionTypeEnum) as [
  OptionTypeEnum,
  ...OptionTypeEnum[],
];
const OptionStatusArray = Object.values(OptionStatusEnum) as [
  OptionStatusEnum,
  ...OptionStatusEnum[],
];

export const OptionSchema = z
  .object({
    id: z.string().optional().openapi({
      description: "Stock Option ID",
      example: "abc123",
    }),

    grantId: z.string().openapi({
      description: "Grant ID",
      example: "grant123",
    }),

    quantity: z.coerce.number().min(0).openapi({
      description: "Quantity of Stock Options",
      example: 100,
    }),

    exercisePrice: z.coerce.number().min(0).openapi({
      description: "Exercise Price per Stock Option",
      example: 10.5,
    }),

    type: z.enum(OptionTypeArray).openapi({
      description: "Type of Stock Option",
      example: "ISO",
    }),

    status: z.enum(OptionStatusArray).openapi({
      description: "Status of Stock Option",
      example: "DRAFT",
    }),

    cliffYears: z.coerce.number().min(0).openapi({
      description: "Cliff Years",
      example: 1,
    }),

    vestingYears: z.coerce.number().min(0).openapi({
      description: "Vesting Years",
      example: 4,
    }),

    issueDate: z.string().date().openapi({
      description: "Issue Date",
      example: "2024-01-01",
    }),

    expirationDate: z.string().date().openapi({
      description: "Expiration Date",
      example: "2028-01-01",
    }),

    vestingStartDate: z.string().date().openapi({
      description: "Vesting Start Date",
      example: "2024-01-01",
    }),

    boardApprovalDate: z.string().date().openapi({
      description: "Board Approval Date",
      example: "2024-01-01",
    }),

    rule144Date: z.string().date().openapi({
      description: "Rule 144 Date",
      example: "2024-01-01",
    }),

    stakeholderId: z.string().openapi({
      description: "Stakeholder ID",
      example: "clz5vr0bd0001tqroiuc7lw1b",
    }),

    companyId: z.string().cuid().openapi({
      description: "Company ID",
      example: "clyvb28ak0000f1ngcn2i0p2m",
    }),

    equityPlanId: z.string().openapi({
      description: "Equity Plan ID",
      example: "clz5vtipf0003tqrovvrpepp8",
    }),

    documents: z
      .array(
        z.object({
          bucketId: z.string(),
          name: z.string(),
        }),
      )
      .optional()
      .openapi({
        description: "Documents",
        example: [
          { bucketId: "clyvb28ak0000f1ngcn2i0p2m", name: "Esign docs" },
        ],
      }),

    createdAt: z.string().date().nullish().openapi({
      description: "Option Created at",
      example: "2024-01-01T00:00:00.000Z",
    }),

    updatedAt: z.string().date().nullish().openapi({
      description: "Option Updated at",
      example: "2024-01-01T00:00:00.000Z",
    }),
  })
  .openapi({
    description: "Get a single option by ID",
  });

export const CreateOptionSchema = OptionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
})
  .strict()
  .openapi({
    description: "Issue options to a stakeholder in a company.",
  });

export const UpdateOptionSchema = OptionSchema.omit({
  id: true,
  documents: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .strict()
  .refine(
    (data) => {
      return Object.values(data).some((value) => value !== undefined);
    },
    {
      message: "At least one field must be provided to update.",
    },
  )
  .openapi({
    description: "Update an option by ID",
  });

export type TOptionSchema = z.infer<typeof OptionSchema>;
export type TCreateOptionSchema = z.infer<typeof CreateOptionSchema>;
export type TUpdateOptionSchema = z.infer<typeof UpdateOptionSchema>;
