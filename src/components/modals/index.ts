"use client";

import { createPushModal } from "pushmodal";
import { ShareClassModal } from "./share-class-modal";
import { TeamMemberModal } from "./team-member/team-member-modal";

export const { pushModal, popModal, ModalProvider } = createPushModal({
  modals: {
    ShareClassModal,
    TeamMemberModal,
  },
});
