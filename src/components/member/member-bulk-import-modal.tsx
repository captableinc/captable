"use client";
import Modal from "@/components/common/modal";
import TeamMemberUploader from "@/components/member/member-uploader";
import { RiGroupLine } from "@remixicon/react";
import { useState } from "react";

export default function MemberBulkImportModal() {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      size="xl"
      title="Import multiple team members"
      subtitle="Import and invite multiple team members to join your company."
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
      trigger={
        <div className="flex cursor-default items-center rounded-sm py-1.5 pr-2 text-sm">
          <RiGroupLine className="mr-2 h-5 w-5" />
          Invite multiple team members
        </div>
      }
    >
      <TeamMemberUploader setOpen={setOpen} />
    </Modal>
  );
}
