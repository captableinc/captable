import {
  adminOnlyProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/api/trpc";
import {
  ZodAcceptMemberMutationSchema,
  ZodDeactivateUserMutationSchema,
  ZodInviteMemberMutationSchema,
  ZodReInviteMutationSchema,
  ZodRemoveMemberMutationSchema,
  ZodRevokeInviteMutationSchema,
  ZodUpdateMemberMutationSchema,
} from "./schema";

import { TRPCError } from "@trpc/server";
import {
  generateInviteToken,
  generateMembershipIdentifier,
  revokeExistingInviteTokens,
  sendMembershipInviteEmail,
} from "@/server/stakeholder";
import { Audit } from "@/server/audit";

export const stakeholderRouter = createTRPCRouter({
  inviteMember: protectedProcedure
    .input(ZodInviteMemberMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { name, email, title, access } = input;

      //token flow same as https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/lib/actions/signin/send-token.ts#L12C4-L12C4
      const { authTokenHash, expires, memberInviteTokenHash, token } =
        await generateInviteToken();

      const { company, verificationToken } = await ctx.db.$transaction(
        async (tx) => {
          const company = await tx.company.findFirstOrThrow({
            where: {
              id: user.companyId,
            },
            select: {
              name: true,
              id: true,
            },
          });

          const prevMembership = await tx.membership.findFirst({
            where: {
              companyId: company.id,
              invitedEmail: email,
              status: "accepted",
            },
          });

          if (prevMembership) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "user already a member",
            });
          }

          const membership = await tx.membership.upsert({
            where: {
              companyId_invitedEmail: {
                companyId: company.id,
                invitedEmail: email,
              },
            },
            update: {},
            create: {
              title,
              access: access ?? "stakeholder",
              companyId: company.id,
              invitedEmail: email,
              active: false,
              isOnboarded: false,
              lastAccessed: new Date(),
              status: "pending",
            },
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  name: true,
                },
              },
              access: true,
            },
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
              action: "stakeholder.invite",
              companyId: company.id,
              actor: { type: "user", id: user.id },
              context: {},
              target: [{ type: "user", id: membership.userId }],
              summary: `${user.name} invited ${membership.user?.name} to join ${company.name} as a ${membership.access}`,
            },
            tx,
          );

          return { verificationToken, company };
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

  acceptMember: protectedProcedure
    .input(ZodAcceptMemberMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

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
            status: "accepted",
            lastAccessed: new Date(),
            isOnboarded: true,
            userId: user.id,
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
          action: "stakeholder.accept",
          companyId: membership.company.id,
          actor: { type: "user", id: user.id },
          context: {},
          target: [{ type: "user", id: membership.userId }],
          summary: `${membership?.user?.name} accepted to join ${membership.company.name} with ${membership.access} access`,
        });

        return { publicId: membership.company.publicId };
      });

      return { success: true, publicId };
    }),

  revokeInvite: adminOnlyProcedure
    .input(ZodRevokeInviteMutationSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const user = session.user;
      const { membershipId, email } = input;

      await db.$transaction(async (tx) => {
        await revokeExistingInviteTokens({ membershipId, email, tx });

        const membership = await tx.membership.findFirst({
          where: {
            id: membershipId,
          },
          select: {
            userId: true,
            user: {
              select: {
                name: true,
              },
            },
            access: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        });

        await Audit.create({
          action: "stakeholder.revoke-invite",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {},
          target: [{ type: "user", id: membership?.userId }],
          summary: `${user.name} revoked ${membership?.user?.name} to join ${membership?.company?.name} with ${membership?.access} access`,
        });
      });

      return { success: true };
    }),

  removeMember: adminOnlyProcedure
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
            action: "stakeholder.remove",
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
    }),

  deactivateUser: adminOnlyProcedure
    .input(ZodDeactivateUserMutationSchema)
    .mutation(async ({ ctx: { session, db }, input }) => {
      const user = session.user;
      const { membershipId, status } = input;

      await db.$transaction(async (tx) => {
        const member = await tx.membership.update({
          where: {
            id: membershipId,
            companyId: session.user.companyId,
          },
          data: {
            active: status,
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
            action: status ? "stakeholder.activate" : "stakeholder.deactivate",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {},
            target: [{ type: "user", id: member.userId }],
            summary: `${user.name} ${
              status ? "activated" : "deactivated"
            } ${member.user?.name} from ${member?.company.name}`,
          },
          tx,
        );
      });

      return { success: true };
    }),

  updateMember: adminOnlyProcedure
    .input(ZodUpdateMemberMutationSchema)
    .mutation(async ({ ctx: { session, db }, input }) => {
      const { membershipId, name, email, ...rest } = input;
      const user = session.user;

      await db.$transaction(async (tx) => {
        const member = await tx.membership.update({
          where: {
            status: "accepted",
            id: membershipId,
            companyId: session.user.companyId,
          },
          data: {
            ...rest,
            user: {
              update: {
                name,
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
            action: "stakeholder.update",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {},
            target: [{ type: "user", id: member.userId }],
            summary: `${user.name} updated ${member.user?.name} details`,
          },
          tx,
        );
      });

      return { success: true };
    }),
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
            select: {
              invitedEmail: true,
              id: true,
              userId: true,
              access: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          });

          const email = membership.invitedEmail;

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
              action: "stakeholder.re-invite",
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
