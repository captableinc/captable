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

      const member = await trx.member.update({
        where: {
          id: input.memberId,
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
        action: "member.accepted",
        companyId: member.company.id,
        actor: { type: "user", id: user.id },
        context: {
          requestIp,
          userAgent,
        },
        target: [{ type: "user", id: member.userId }],
        summary: `${member?.user?.name} joined ${member.company.name}`,
      });

      return { publicId: member.company.publicId };
    });

    return { success: true, publicId };
  });
