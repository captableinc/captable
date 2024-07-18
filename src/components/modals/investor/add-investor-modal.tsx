"use client";

import type { ModalSizeType } from "@/components/common/modal";
import Modal from "@/components/common/push-modal";
import { InvestorForm } from "./add-investor-form";

type InvestorType = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  size?: ModalSizeType;
};

export const InvestorModal = ({
  title,
  subtitle,
  size = "md",
}: InvestorType) => {
  return (
    <Modal size={size} title={title} subtitle={subtitle}>
      <InvestorForm />
    </Modal>
  );
};
