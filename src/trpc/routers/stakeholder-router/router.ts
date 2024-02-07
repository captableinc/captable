import { createTRPCRouter } from "@/trpc/api/trpc";

import { inviteMemberProcedure } from "./invite-member";
import { acceptMemberProcedure } from "./accept-member";
import { revokeInviteProcedure } from "./revoke-invite";
import { removeMemberProcedure } from "./remove-member";
import { deactivateUserProcedure } from "./deactivate-user";
import { updateMemberProcedure } from "./update-member";
import { reInviteProcedure } from "./re-invite";
import { getMembersProcedure } from "./get-members";

export const stakeholderRouter = createTRPCRouter({
  inviteMember: inviteMemberProcedure,

  acceptMember: acceptMemberProcedure,

  revokeInvite: revokeInviteProcedure,

  removeMember: removeMemberProcedure,

  deactivateUser: deactivateUserProcedure,

  updateMember: updateMemberProcedure,

  reInvite: reInviteProcedure,

  getMembers: getMembersProcedure,
});
