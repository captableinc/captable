"use client";

import { createPushModal } from "pushmodal";
import { ShareClassModal } from "./share-class-modal";

export const { pushModal, popModal, ModalProvider } = createPushModal({
  modals: {
    ShareClassModal,
  },
});
