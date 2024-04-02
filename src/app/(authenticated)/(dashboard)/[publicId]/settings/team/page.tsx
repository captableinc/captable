import MemberBulkImportModal from "@/components/member/member-bulk-import-modal";
import MemberModal from "@/components/member/member-modal";
import MemberTable from "@/components/member/member-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/server";
import { RiAddLine, RiUserLine } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
};

const TeamMembersPage = async () => {
  const members = await api.member.getMembers.query();
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Team</h3>
          <p className="text-sm text-muted-foreground">
            Manage and invite team members
          </p>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="w-full md:w-auto" size="sm">
                <RiAddLine className="inline-block h-5 w-5" />
                Invite member
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <MemberModal
                  title="Invite a team member"
                  subtitle="Invite a team member to your company."
                  member={{
                    name: "",
                    email: "",
                    title: "",
                  }}
                >
                  <div className="flex cursor-default items-center rounded-sm py-1.5 pr-2 text-sm">
                    <RiUserLine className="mr-2 h-5 w-5" />
                    Invite Individual
                  </div>
                </MemberModal>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <MemberBulkImportModal />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <MemberTable members={members.data} />
      </Card>
    </div>
  );
};

export default TeamMembersPage;
