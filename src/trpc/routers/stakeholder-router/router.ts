import {
  adminOnlyProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/api/trpc";
import { ZodReInviteMutationSchema } from "./schema";

import {
  generateInviteToken,
  generateMembershipIdentifier,
  revokeExistingInviteTokens,
  sendMembershipInviteEmail,
} from "@/server/stakeholder";
import { Audit } from "@/server/audit";
import { inviteMemberProcedure } from "./invite-member";
import { acceptMemberProcedure } from "./accept-member";
import { revokeInviteProcedure } from "./revoke-invite";
import { removeMemberProcedure } from "./remove-member";
import { deactivateUserProcedure } from "./deactivate-user";
import { updateMemberProcedure } from "./update-member";

export const stakeholderRouter = createTRPCRouter({
  inviteMember: inviteMemberProcedure,

  acceptMember: acceptMemberProcedure,

  revokeInvite: revokeInviteProcedure,

  removeMember: removeMemberProcedure,

  deactivateUser: deactivateUserProcedure,

  updateMember: updateMemberProcedure,
  reInvite: adminOnlyProcedure
    .input(ZodReInviteMutationSchema)
    .mutation(async ({ ctx: { session, db }, input }) => {
      const user = session.user;
      const companyId = user.companyId;

      const { authTokenHash, expires, memberInviteTokenHash, token } =
        await generateInviteToken();

      const { company, verificationToken, email } = await db.$transaction(
        async (tx) => {
          const company = await tx.company.findFirstOrThrow({
            where: {
              id: companyId,
            },
            select: {
              name: true,
              id: true,
            },
          });

          const membership = await tx.membership.findFirstOrThrow({
            where: {
              id: input.membershipId,
              status: "pending",
              companyId,
            },

            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          });

          const email = membership.user.email;

          if (!email) {
            throw new Error("invited email not found");
          }

          await revokeExistingInviteTokens({
            membershipId: membership.id,
            email,
            tx,
          });

          // custom verification token for member invitation
          const { token: verificationToken } =
            await tx.verificationToken.create({
              data: {
                identifier: generateMembershipIdentifier({
                  email,
                  membershipId: membership.id,
                }),
                token: memberInviteTokenHash,
                expires,
              },
            });

          // next-auth verification token
          await tx.verificationToken.create({
            data: {
              identifier: email,
              token: authTokenHash,
              expires,
            },
          });

          await Audit.create(
            {
              action: "stakeholder.re-invited",
              companyId: company.id,
              actor: { type: "user", id: user.id },
              context: {},
              target: [{ type: "user", id: membership.userId }],
              summary: `${user.name} reinvited ${membership.user?.name} to join ${company.name} with ${membership.access} access`,
            },
            tx,
          );

          return { verificationToken, company, email };
        },
      );

      await sendMembershipInviteEmail({
        verificationToken,
        token,
        email,
        company,
        user: {
          email: user.email,
          name: user.name,
        },
      });

      return { success: true };
    }),

  getMembers: protectedProcedure.query(async ({ ctx }) => {
    const {
      db,
      session: { user },
    } = ctx;

    const data = await db.membership.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    return { data };
  }),
});
