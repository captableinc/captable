"use client";

import Modal from "@/components/common/push-modal";
import type { ShareClassMutationType } from "@/trpc/routers/share-class/schema";
import ShareClassForm from "./share-class-form";

type ShareClassType = {
  type: "create" | "update";
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  shareClass?: ShareClassMutationType;
  shareClasses?: ShareClassMutationType[];
};

export const ShareClassModal = ({
  title,
  subtitle,
  shareClass,
  shareClasses = [] as ShareClassMutationType[],
  type = "create",
}: ShareClassType) => {
  return (
    <Modal size="2xl" title={title} subtitle={subtitle}>
      <ShareClassForm
        type={type}
        shareClass={shareClass}
        shareClasses={shareClasses}
      />
    </Modal>
  );
};
