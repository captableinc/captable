import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  StakeholderSchema,
  type TStakeholderSchema,
} from "@/server/api/schema/stakeholder";
import { db } from "@/server/db";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import { RequestParamsSchema } from "./delete";

const ResponseSchema = z
  .object({
    data: StakeholderSchema,
  })
  .openapi({
    description: "Get a single stakeholder by ID",
  });

const route = createRoute({
  method: "get",
  path: "/v1/companies/{id}/stakeholders/{stakeholderId}",
  request: { params: RequestParamsSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Get a single stakeholder by ID",
    },

    ...ErrorResponses,
  },
});

const getOne = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company } = await withCompanyAuth(c);

    const params = c.req.param();
    const stakeholderId = params.stakeholderId as string;

    const stakeholder = (await db.stakeholder.findFirst({
      where: {
        id: stakeholderId,
        companyId: company.id,
      },
    })) as unknown as TStakeholderSchema;

    if (!stakeholder) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "Stakeholder not found",
      });
    }

    return c.json({ data: stakeholder }, 200);
  });
};

export default getOne;

// import { checkMembership } from "@/server/auth";
// import { updateStakeholder } from "@/server/services/stakeholder/update-stakeholder";
// import { withAuth } from "@/trpc/api/trpc";
// import { ZodUpdateStakeholderMutationSchema } from "../schema";

// export const updateStakeholdersProcedure = withAuth
//   .input(ZodUpdateStakeholderMutationSchema)
//   .mutation(async ({ ctx: { db, session, requestIp, userAgent }, input }) => {
//     const user = session.user;
//     const { id: stakeholderId, ...rest } = input;
//     try {
//       const { companyId } = await checkMembership({ session, tx: db });

//       const payload = {
//         stakeholderId: stakeholderId as string,
//         companyId,
//         requestIp,
//         userAgent,
//         data: rest,
//         user: {
//           id: user.id,
//           name: user.name as string,
//         },
//       };

//       await updateStakeholder({
//         db,
//         payload,
//       });

//       return {
//         success: true,
//         message: "Stakeholder updated successfully!",
//       };
//     } catch (error) {
//       console.error("Error updating stakeholders:", error);
//       return {
//         success: false,
//         message: "Oops, something went wrong. Please try again later.",
//       };
//     }
//   });
