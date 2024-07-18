import Message from "@/components/common/message";
import Modal from "@/components/common/modal";
import { SafeForm } from "@/components/safe/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

type SafeModalProps = {
  type: "create" | "import";
};

export const SafeModal: React.FC<SafeModalProps> = ({ type }) => {
  const [open, setOpen] = useState(true);

  return (
    <Modal
      size="4xl"
      title={
        type === "create"
          ? "Create a new SAFE agreement"
          : "Import an existing SAFE agreement"
      }
      subtitle={
        type === "create" ? (
          <Message
            description={
              "Based on the information provided, we will generate a standard Y-Combinator SAFE agreement for you and your investor to review and sign. You can also upload your custom SAFE agreement."
            }
          >
            <Button
              size={"xs"}
              variant={"ghost"}
              type="button"
              className="rounded bg-teal-100 border-teal-200 border-1 px-2 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-teal-50"
              onClick={() => {
                window.open("https://captable.inc/help", "_blank");
              }}
            >
              Upload custom SAFE agreement
            </Button>

            {/* TODO: Write a helkp article on SAFE */}
            <Button size="xs" variant={"outline"} className="ml-3">
              <Link href="https://captable.inc/help" target="_blank">
                Learn more
              </Link>
            </Button>
          </Message>
        ) : (
          "Record an existing SAFE agreement to keep track of it in your captable."
        )
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
