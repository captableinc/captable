"use client";
import Modal from "@/components/shared/modal";
import { useState } from "react";
import TeamMemberUploader from "@/components/member/member-uploader";
import { RiGroupLine } from "@remixicon/react";

export default function MemberBulkImportModal() {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      title="Invite a team member"
      subtitle="Invite a team member to your company."
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
      trigger={
        <div className="flex cursor-default items-center rounded-sm py-1.5 pr-2 text-sm">
          <RiGroupLine className="mr-2 h-5 w-5" />
          Bulk Import
        </div>
      }
    >
      <TeamMemberUploader setOpen={setOpen} />
    </Modal>
  );
}
