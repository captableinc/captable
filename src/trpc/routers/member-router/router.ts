import { createTRPCRouter } from "@/trpc/api/trpc";

import { inviteMemberProcedure } from "./procedures/invite-member";
import { acceptMemberProcedure } from "./procedures/accept-member";
import { revokeInviteProcedure } from "./procedures/revoke-invite";
import { removeMemberProcedure } from "./procedures/remove-member";
import { toggleActivation } from "./procedures/toggle-activation";
import { updateMemberProcedure } from "./procedures/update-member";
import { reInviteProcedure } from "./procedures/re-invite";
import { getMembersProcedure } from "./procedures/get-members";
import { updateProfileProcedure } from "./procedures/update-profile";
import { getProfileProcedure } from "./procedures/get-profile";

export const memberRouter = createTRPCRouter({
  inviteMember: inviteMemberProcedure,
  acceptMember: acceptMemberProcedure,
  revokeInvite: revokeInviteProcedure,
  removeMember: removeMemberProcedure,
  toggleActivation: toggleActivation,
  updateMember: updateMemberProcedure,
  reInvite: reInviteProcedure,
  getMembers: getMembersProcedure,
  getProfile: getProfileProcedure,
  updateProfile: updateProfileProcedure,
});
