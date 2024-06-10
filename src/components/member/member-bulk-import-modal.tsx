"use client";
import Modal from "@/components/common/modal";
import TeamMemberUploader from "@/components/member/member-uploader";
import { Button } from "@/components/ui/button";
import { RiGroup2Fill } from "@remixicon/react";
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
        <li>
          <Button variant="ghost" size="sm" type="submit">
            <>
              <RiGroup2Fill className="mr-2 h-4 w-4" />
              Invite multiple team members
            </>
          </Button>
        </li>
      }
    >
      <TeamMemberUploader setOpen={setOpen} />
    </Modal>
  );
}
