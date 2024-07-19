"use client";

import Modal from "@/components/common/push-modal";

type ShareClassType = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
};

export const BankAccountModal = ({ title, subtitle }: ShareClassType) => {
  return (
    <Modal size="xl" title={title} subtitle={subtitle}>
      Please clone this file and implement the modal.
    </Modal>
  );
};
