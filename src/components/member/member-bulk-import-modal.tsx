"use client";
import Modal from "@/components/common/modal";
import TeamMemberUploader from "@/components/member/member-uploader";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
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
              <Icon name="group-2-fill" className="mr-2 h-4 w-4" />
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
