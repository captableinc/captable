import { adminOnlyProcedure } from "@/trpc/api/trpc";
import { ZodRemoveMemberMutationSchema } from "../schema";
import { Audit } from "@/server/audit";

export const removeMemberProcedure = adminOnlyProcedure
  .input(ZodRemoveMemberMutationSchema)
  .mutation(async ({ ctx: { session, db }, input }) => {
    const user = session.user;
    const { membershipId } = input;

    await db.$transaction(async (tx) => {
      const member = await tx.membership.delete({
        where: {
          id: membershipId,
          companyId: session.user.companyId,
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
          action: "stakeholder.removed",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {},
          target: [{ type: "user", id: member.userId }],
          summary: `${user.name} removed ${member.user?.name} from ${member?.company?.name}`,
        },
        tx,
      );
    });

    return { success: true };
  });
