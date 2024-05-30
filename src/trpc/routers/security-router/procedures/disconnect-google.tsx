import { sendGoogleAccountDisconnectEmail } from "@/jobs/google-account-disconnect-email";
import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";

export const disConnectGoogleProcedure = withAuth.mutation(
  async ({ ctx: { session, db, userAgent, requestIp } }) => {
    const currentUserName = session.user.name as string;
    const currentMemberId = session.user.memberId;
    const currentUserId = session.user.id;
    const companyId = session.user.companyId;
    try {
      const { linkedEmail, companyName } = await db.$transaction(async (tx) => {
        const member = await db.member.findFirst({
          where: {
            userId: currentUserId,
          },
        });

        if (!member?.linkedEmail) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Member don't have any connected google account yet.",
          });
        }

        const user = await db.member.update({
          where: {
            id: currentMemberId,
          },
          data: {
            linkedEmail: null,
          },
          select: {
            company: {
              select: {
                name: true,
              },
            },
          },
        });

        console.log({ user }, "user from disconnected Google");

        await Audit.create(
          {
            action: "google-account.disconnected",
            companyId,
            actor: { type: "user", id: currentUserId },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "user", id: currentUserId }],
            summary: `${session.user.name} disconnected a google account: ${member.linkedEmail}`,
          },
          tx,
        );
        return {
          linkedEmail: member.linkedEmail,
          companyName: user.company.name,
        };
      });

      console.log(linkedEmail, currentUserName, companyName);
      await sendGoogleAccountDisconnectEmail({
        email: linkedEmail,
        username: currentUserName,
        companyName: companyName,
      });

      return {
        success: true,
        message: "Google account disconnected successfully",
      };
    } catch (error) {
      console.error(error);
      if (error instanceof TRPCError) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: "Oops ! Something went out. Please try again later.",
      };
    }
  },
);
