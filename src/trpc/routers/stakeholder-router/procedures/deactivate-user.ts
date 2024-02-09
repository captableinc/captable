import { adminOnlyProcedure } from "@/trpc/api/trpc";
import { ZodDeactivateUserMutationSchema } from "../schema";
import { Audit } from "@/server/audit";

export const deactivateUserProcedure = adminOnlyProcedure
  .input(ZodDeactivateUserMutationSchema)
  .mutation(async ({ ctx: { session, db, requestIp, userAgent }, input }) => {
    const user = session.user;
    const { membershipId, status } = input;

    await db.$transaction(async (tx) => {
      const member = await tx.membership.update({
        where: {
          id: membershipId,
          companyId: session.user.companyId,
        },
        data: {
          active: status,
        },
        select: {
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      await Audit.create(
        {
          action: status ? "stakeholder.activated" : "stakeholder.deactivated",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "user", id: member.userId }],
          summary: `${user.name} ${
            status ? "activated" : "deactivated"
          } ${member.user?.name} from ${member?.company.name}`,
        },
        tx,
      );
    });

    return { success: true };
  });
