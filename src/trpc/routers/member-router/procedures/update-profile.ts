import { withAuth } from "@/trpc/api/trpc";
import { ZodUpdateProfileMutationSchema } from "../schema";
import { Audit } from "@/server/audit";

export const updateProfileProcedure = withAuth
  .input(ZodUpdateProfileMutationSchema)
  .mutation(async ({ ctx: { session, db, requestIp, userAgent }, input }) => {
    const { fullName, loginEmail, workEmail, jobTitle, avatarUrl } = input;
    const user = session.user;

    await db.$transaction(async (tx) => {
      const member = await tx.member.update({
        where: {
          status: "ACTIVE",
          id: user.memberId,
          companyId: user.companyId,
        },
        data: {
          title: jobTitle,
          workEmail,
          user: {
            update: {
              name: fullName,
              email: loginEmail,
              image: avatarUrl,
            },
          },
        },
        select: {
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      await Audit.create(
        {
          action: "member.updated",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "user", id: member.userId }],
          summary: `${user.name} updated the profile`,
        },
        tx,
      );
    });

    return { success: true };
  });
