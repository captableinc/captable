import MemberTable from "@/components/member/member-table";
import { Card } from "@/components/ui/card";

import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { AddTeamMemberDropdownMenu } from "./add-team-member-dropdown-menu";

export const metadata: Metadata = {
  title: "Team",
};

const TeamMembersPage = async () => {
  const [members, roles] = await Promise.all([
    api.member.getMembers.query(),
    api.rbac.listRoles.query(),
  ]);
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
          <AddTeamMemberDropdownMenu roles={roles.rolesList} />
        </div>
      </div>

      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <MemberTable members={members.data} roles={roles.rolesList} />
      </Card>
    </div>
  );
};

export default TeamMembersPage;
