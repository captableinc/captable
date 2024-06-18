"use client";

import Modal from "@/components/common/push-modal";
import { SingleStakeholderForm } from "./single-stake-holder-form";

type StakeholderType = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
};

export const SingleStakeholdersModal = ({
  title,
  subtitle,
}: StakeholderType) => {
  return (
    <Modal size="2xl" title={title} subtitle={subtitle}>
      <SingleStakeholderForm type="create" />
    </Modal>
  );
};
