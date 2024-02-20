import MemberModal from "@/components/member/member-modal";
import MemberTable from "@/components/member/member-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { api } from "@/trpc/server";
import { RiAddLine } from "@remixicon/react";

const StakeholdersPage = async () => {
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
          <MemberModal
            title="Invite a team member"
            subtitle="Invite a team member to your company."
            member={{
              name: "",
              email: "",
              title: "",
            }}
          >
            <Button className="w-full md:w-auto" size="sm">
              <RiAddLine className="inline-block h-5 w-5" />
              Team member
            </Button>
          </MemberModal>
        </div>
      </div>

      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <MemberTable members={members.data} />
      </Card>
    </div>
  );
};

export default StakeholdersPage;
