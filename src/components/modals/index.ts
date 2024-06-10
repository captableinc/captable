"use client";

import { createPushModal } from "pushmodal";
import { ShareClassModal } from "./share-class-modal";
import { SingleStakeholdersModal } from "./stakeholder/single-stake-holder-modal";
import { TeamMemberModal } from "./team-member/team-member-modal";
import { WipModal } from "./wip-modal";

export const { pushModal, popModal, ModalProvider } = createPushModal({
  modals: {
    WipModal,
    ShareClassModal,
    TeamMemberModal,
    SingleStakeholdersModal,
  },
});
