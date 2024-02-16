import { protectedProcedure } from "@/trpc/api/trpc";
import { ZodAcceptMemberMutationSchema } from "../schema";
import { Audit } from "@/server/audit";

export const acceptMemberProcedure = protectedProcedure
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
          active: true,
          status: "ACCEPTED",
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
          access: true,
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
        summary: `${membership?.user?.name} accepted to join ${membership.company.name} with ${membership.access} access`,
      });

      return { publicId: membership.company.publicId };
    });

    return { success: true, publicId };
  });
