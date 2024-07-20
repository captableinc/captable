"use client";

import Modal from "@/components/common/push-modal";
import { InvestorForm } from "./add-investor-form";

type InvestorType = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
};

export const InvestorModal = ({ title, subtitle }: InvestorType) => {
  return (
    <Modal size="2xl" title={title} subtitle={subtitle}>
      <InvestorForm />
    </Modal>
  );
};
