import { Audit } from "@/server/audit";
import { withAccessControl } from "@/trpc/api/trpc";
import { ZodAddStakeholderArrayMutationSchema } from "../schema";

export const addStakeholdersProcedure = withAccessControl
  .input(ZodAddStakeholderArrayMutationSchema)
  .meta({ policies: { stakeholder: { allow: ["create"] } } })
  .mutation(
    async ({
      ctx: { db, membership, userAgent, requestIp, session },
      input,
    }) => {
      try {
        const { user } = session;
        await db.$transaction(async (tx) => {
          // insert companyId in every input
          const inputDataWithCompanyId = input.map((stakeholder) => ({
            ...stakeholder,
            companyId: membership.companyId,
          }));

          await tx.stakeholder.createMany({
            data: inputDataWithCompanyId,
            skipDuplicates: true,
          });

          inputDataWithCompanyId.map(async (inp) => {
            await Audit.create(
              {
                action: "stakeholder.added",
                companyId: user.companyId,
                actor: { type: "user", id: user.id },
                context: {
                  userAgent,
                  requestIp,
                },
                target: [{ type: "stakeholder", id: inp.id }],
                summary: `${user.name} added stakeholder ${inp.name} for the company ID ${inp.companyId}`,
              },
              tx,
            );
          });
        });

        return {
          success: true,
          message: "Stakeholders added successfully!",
        };
      } catch (_error) {
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    },
  );
