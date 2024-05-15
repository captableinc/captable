import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";
import { ZodToggleActivationMutationSchema } from "../schema";

export const toggleActivation = withAuth
  .input(ZodToggleActivationMutationSchema)
  .mutation(async ({ ctx: { session, db, requestIp, userAgent }, input }) => {
    const user = session.user;
    const { memberId, status } = input;

    await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const member = await tx.member.update({
        where: {
          id: memberId,
          companyId,
        },
        data: {
          status,
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
          action: status ? "member.activated" : "member.deactivated",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "user", id: member.userId }],
          summary: `${user.name} ${status ? "activated" : "deactivated"} ${
            member.user?.name
          } from ${member?.company.name}`,
        },
        tx,
      );
    });

    return { success: true };
  });
