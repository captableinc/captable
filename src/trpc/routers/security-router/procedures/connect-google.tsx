import { sendGoogleAccountConnectEmail } from "@/jobs/google-account-connect-email";
import { Audit } from "@/server/audit";
import type { PrismaTransactionalClient } from "@/server/db";
import { withAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { ZodConnectGoogleMutationSchema } from "../schema";

async function updateLinkedEmail(
  memberId: string,
  inputEmail: string,
  db: PrismaTransactionalClient,
): Promise<{ companyName: string }> {
  const member = await db.member.update({
    where: {
      id: memberId,
    },
    data: {
      linkedEmail: inputEmail,
    },
    select: {
      company: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    companyName: member.company.name,
  };
}

export const connectGoogleProcedure = withAuth
  .input(ZodConnectGoogleMutationSchema)
  .mutation(async ({ ctx: { session, db, userAgent, requestIp }, input }) => {
    const currentUserName = session.user.name as string;
    const currentUserId = session.user.id;
    const currentMemberId = session.user.memberId;
    const currentUserEmail = session.user.email as string;
    const companyId = session.user.companyId;

    try {
      if (!currentUserEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Login email doesnot exist",
        });
      }
      const { companyName } = await db.$transaction(async (tx) => {
        let _companyName = "";

        if (input.email === currentUserEmail) {
          const { companyName } = await updateLinkedEmail(
            currentMemberId,
            input.email,
            tx,
          );
          _companyName = companyName;
        } else {
          const existingUser = await db.user.findUnique({
            where: {
              email: input.email,
              emailVerified: {
                not: null,
              },
            },
            select: {
              email: true,
            },
          });

          if (existingUser) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User already exists with that email",
            });
          }
          const { companyName } = await updateLinkedEmail(
            currentMemberId,
            input.email,
            tx,
          );
          _companyName = companyName;
        }

        await Audit.create(
          {
            action: "google-account.connected",
            companyId,
            actor: { type: "user", id: currentUserId },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "user", id: currentUserId }],
            summary: `${session.user.name} connected a google account: ${input.email}`,
          },
          tx,
        );
        return { companyName: _companyName };
      });

      await sendGoogleAccountConnectEmail({
        email: input.email,
        username: currentUserName,
        companyName,
      });

      return {
        success: true,
        message: "Google account connected successfully",
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
  });
