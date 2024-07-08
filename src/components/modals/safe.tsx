import Modal from "@/components/common/modal";
import { SafeForm } from "@/components/safe/form";
import { useState } from "react";

type SafeModalProps = {
  type: "create" | "import";
};

export const SafeModal: React.FC<SafeModalProps> = ({ type }) => {
  const [open, setOpen] = useState(true);

  return (
    <Modal
      size="3xl"
      title={
        type === "create"
          ? "Create a new SAFE agreement"
          : "Import an existing SAFE agreement"
      }
      subtitle={
        type === "create"
          ? "Create, sign and send a new SAFE agreement to your investors."
          : "Record an existing SAFE agreement to keep track of it in your captable."
      }
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
    >
      <SafeForm type={type} />
    </Modal>
  );
};
