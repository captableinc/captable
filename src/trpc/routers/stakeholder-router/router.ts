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
import { reInviteProcedure } from "./re-invite";

export const stakeholderRouter = createTRPCRouter({
  inviteMember: inviteMemberProcedure,

  acceptMember: acceptMemberProcedure,

  revokeInvite: revokeInviteProcedure,

  removeMember: removeMemberProcedure,

  deactivateUser: deactivateUserProcedure,

  updateMember: updateMemberProcedure,

  reInvite: reInviteProcedure,

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
