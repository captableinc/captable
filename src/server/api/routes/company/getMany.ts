import { withMemberAuth } from "@/server/api/auth";
import { ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import { db } from "@/server/db";
import { createRoute, z } from "@hono/zod-openapi";
import type { Company } from "@prisma/client";
import type { Context } from "hono";

export const ResponseSchema = z.object({
  id: z.string().cuid().openapi({
    description: "Company ID",
    example: "clxwbok580000i7nge8nm1ry0",
  }),

  name: z.string().openapi({
    description: "Company name",
    example: "Acme Inc.",
  }),

  logo: z.string().optional().openapi({
    description: "Company logo",
    example: "https://example.com/logo.png",
  }),

  website: z.string().optional().openapi({
    description: "Company website",
    example: "https://example.com",
  }),

  incorporationType: z.string().optional().openapi({
    description: "Company incorporation type",
    example: "LLC",
  }),

  incorporationDate: z.string().optional().openapi({
    description: "Company incorporation date",
    example: "2024-01-01",
  }),

  incorporationState: z.string().optional().openapi({
    description: "Company incorporation state",
    example: "CA",
  }),

  incorporationCountry: z.string().optional().openapi({
    description: "Company incorporation country",
    example: "USA",
  }),

  streetAddress: z.string().optional().openapi({
    description: "Company street address",
    example: "123 Main St.",
  }),

  city: z.string().optional().openapi({
    description: "Company city",
    example: "San Francisco",
  }),

  state: z.string().optional().openapi({
    description: "Company state",
    example: "CA",
  }),

  country: z.string().optional().openapi({
    description: "Company country",
    example: "USA",
  }),

  zipcode: z.string().optional().openapi({
    description: "Company zipcode",
    example: "94105",
  }),

  createdAt: z.string().openapi({
    description: "Company creation date",
    example: "2024-01-01T00:00:00Z",
  }),

  updatedAt: z.string().openapi({
    description: "Company last updated date",
    example: "2024-01-01T00:00:00Z",
  }),
});

const route = createRoute({
  method: "get",
  path: "api/v1/companies",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(ResponseSchema).openapi({
            description: "List of companies",
          }),
        },
      },
      description: "List companies",
    },

    ...ErrorResponses,
  },
});
const getMany = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const headers = c.req.header;

    const { membership } = await withMemberAuth(headers);
    const companyIds = membership.map((m) => m.companyId);

    const companies = (await db.company.findMany({
      where: {
        id: {
          in: companyIds,
        },
      },
    })) as Company[];

    const response = companies.map((company) => ({
      ...company,
      logo: company.logo ?? undefined,
      website: company.website ?? undefined,
    }));

    return c.json(response, 200);
  });
};

export default getMany;
export type ResponseSchemaType = z.infer<typeof ResponseSchema>;
