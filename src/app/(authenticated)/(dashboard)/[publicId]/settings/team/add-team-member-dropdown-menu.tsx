"use client";

import MemberBulkImportModal from "@/components/member/member-bulk-import-modal";
import { pushModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiAccountCircleFill, RiAddLine } from "@remixicon/react";

export const AddTeamMemberDropdownMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="w-full md:w-auto" size="sm">
          <RiAddLine className="inline-block h-5 w-5" />
          Team member
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ul>
          <li>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              onClick={() => {
                pushModal("TeamMemberModal", {
                  title: "Invite a team member",
                  subtitle: "Invite a team member to your company.",
                  member: {
                    name: "",
                    loginEmail: "",
                    title: "",
                    workEmail: "",
                  },
                });
              }}
            >
              <>
                <RiAccountCircleFill className="mr-2 h-4 w-4" />
                Invite a team member
              </>
            </Button>
          </li>

          <MemberBulkImportModal />
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
