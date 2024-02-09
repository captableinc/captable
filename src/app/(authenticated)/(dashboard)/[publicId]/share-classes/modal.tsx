"use client";

import { useState } from "react";
import ShareClassForm from "./form";
import Modal from "@/components/shared/modal";
import { type ShareClassMutationType } from "@/trpc/routers/share-class/schema";

type ShareClassType = {
  type: string;
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  trigger: React.ReactNode;
  shareClass?: ShareClassMutationType;
};

const ShareClassModal = ({
  title,
  subtitle,
  trigger,
  shareClass,
  type = "create",
}: ShareClassType) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      size="2xl"
      title={title}
      subtitle={subtitle}
      trigger={trigger}
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
    >
      <ShareClassForm type={type} setOpen={setOpen} shareClass={shareClass} />
    </Modal>
  );
};

export default ShareClassModal;
