import { withAuth } from "@/trpc/api/trpc";
import { ZodAcceptMemberMutationSchema } from "../schema";
import { Audit } from "@/server/audit";

export const acceptMemberProcedure = withAuth
  .input(ZodAcceptMemberMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { userAgent, requestIp } = ctx;

    const { publicId } = await ctx.db.$transaction(async (trx) => {
      await trx.verificationToken.delete({
        where: {
          token: input.token,
        },
      });

      await trx.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: input.name,
        },
      });

      const membership = await trx.membership.update({
        where: {
          id: input.membershipId,
        },
        data: {
          status: "ACTIVE",
          lastAccessed: new Date(),
          isOnboarded: true,
          userId: user.id,
          workEmail: input.workEmail,
        },
        select: {
          company: {
            select: {
              publicId: true,
              name: true,
              id: true,
            },
          },
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      await Audit.create({
        action: "stakeholder.accepted",
        companyId: membership.company.id,
        actor: { type: "user", id: user.id },
        context: {
          requestIp,
          userAgent,
        },
        target: [{ type: "user", id: membership.userId }],
        summary: `${membership?.user?.name} joined ${membership.company.name}`,
      });

      return { publicId: membership.company.publicId };
    });

    return { success: true, publicId };
  });
