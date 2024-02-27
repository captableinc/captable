import { withAuth } from "@/trpc/api/trpc";
import { ZodUpdateProfileMutationSchema } from "../schema";
import { Audit } from "@/server/audit";

export const updateProfileProcedure = withAuth
  .input(ZodUpdateProfileMutationSchema)
  .mutation(async ({ ctx: { session, db, requestIp, userAgent }, input }) => {
    const user = session.user;

    if (input.type === "profile") {
      const { fullName, loginEmail, workEmail, jobTitle } = input.profile;

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
            summary: `${user.name} updated the profile information.`,
          },
          tx,
        );
      });

      return { success: true };
    }

    if (input.type === "avatar") {
      const { avatarUrl } = input;

      await db.$transaction(async (tx) => {
        const member = await tx.member.update({
          where: {
            status: "ACTIVE",
            id: user.memberId,
            companyId: user.companyId,
          },
          data: {
            user: {
              update: {
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
            summary: `${user.name} uploaded new profile avatar.`,
          },
          tx,
        );
      });

      return { success: true };
    }
  });
