import { withAccessControl } from "@/trpc/api/trpc";
import { StakeholderRelationshipEnum } from "@prisma/client";
import { z } from "zod";

export const getStakeholdersProcedure = withAccessControl
  .meta({ policies: { stakeholder: { allow: ["read"] } } })
  .input(
    z
      .object({
        investor: z.boolean().optional(),
      })
      .optional(),
  )
  .query(async ({ ctx, input }) => {
    const { db, membership } = ctx;
    const investor = input?.investor;

    console.log("------------------------------------------------>");
    console.log("isInvestor", investor);

    const data = await db.stakeholder.findMany({
      where: {
        companyId: membership.companyId,
        ...(investor && {
          currentRelationship: StakeholderRelationshipEnum.INVESTOR,
        }),
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  });
