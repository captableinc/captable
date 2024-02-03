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

      const data = await ctx.db.$transaction([
        ctx.db.verificationToken.delete({
          where: {
            token: input.token,
          },
        }),
        ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: input.name,
          },
        }),
        ctx.db.membership.update({
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
              },
            },
          },
        }),
      ]);

      return { success: true, publicId: data[2].company.publicId };
    }),

  revokeInvite: adminOnlyProcedure
    .input(ZodRevokeInviteMutationSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const { membershipId, email } = input;

      await revokeExistingInviteTokens({ membershipId, email, tx: db });

      return { success: true };
    }),

  removeMember: adminOnlyProcedure
    .input(ZodRemoveMemberMutationSchema)
    .mutation(async ({ ctx: { session, db }, input }) => {
      const { membershipId } = input;

      await db.membership.delete({
        where: {
          id: membershipId,
          companyId: session.user.companyId,
        },
      });

      return { success: true };
    }),

  deactivateUser: adminOnlyProcedure
    .input(ZodDeactivateUserMutationSchema)
    .mutation(async ({ ctx: { session, db }, input }) => {
      const { membershipId, status } = input;

      await db.membership.update({
        where: {
          id: membershipId,
          companyId: session.user.companyId,
        },
        data: {
          active: status,
        },
      });

      return { success: true };
    }),

  updateMember: adminOnlyProcedure
    .input(ZodUpdateMemberMutationSchema)
    .mutation(async ({ ctx: { session, db }, input }) => {
      const { membershipId, name, email, ...rest } = input;

      await db.membership.update({
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

          const membership = await db.membership.findFirstOrThrow({
            where: {
              id: input.membershipId,
              status: "pending",
              companyId,
            },
            select: {
              invitedEmail: true,
              id: true,
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
