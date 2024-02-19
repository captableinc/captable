import MemberModal from "@/components/stakeholder/member-modal";
import MemberTable from "@/components/stakeholder/member-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { api } from "@/trpc/server";
import { RiAddLine } from "@remixicon/react";

const StakeholdersPage = async () => {
  const members = await api.stakeholder.getMembers.query();

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Stakeholders</h3>
          <p className="text-sm text-muted-foreground">
            Manage your company{`'`}s stakeholders
          </p>
        </div>

        <div>
          <MemberModal
            title="Add a stakeholder"
            subtitle="Add a stakeholder to your company."
            member={{
              name: "",
              email: "",
              title: "",
            }}
          >
            <Button className="w-full md:w-auto">
              <RiAddLine className="inline-block h-5 w-5" />
              Stakeholder
            </Button>
          </MemberModal>
        </div>
      </div>

      <Card className="mt-3">
        <MemberTable members={members.data} />
      </Card>
    </div>
  );
};

export default StakeholdersPage;
