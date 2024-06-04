"use client";

import MemberBulkImportModal from "@/components/member/member-bulk-import-modal";
import { pushModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiAddLine, RiUserLine } from "@remixicon/react";

export const AddTeamMemberDropdownMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="w-full md:w-auto" size="sm">
          <RiAddLine className="inline-block h-5 w-5" />
          Invite member
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          asChild
          onClick={() => {
            pushModal("TeamMemberModal", {
              title: "Invite a team member",
              subtitle: "Invite a team member to your company.",
              member: {
                name: "",
                email: "",
                title: "",
              },
            });
          }}
        >
          <div className="flex cursor-default items-center rounded-sm py-1.5 pr-2 text-sm">
            <RiUserLine className="mr-2 h-5 w-5" />
            Invite a team member
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <MemberBulkImportModal />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
