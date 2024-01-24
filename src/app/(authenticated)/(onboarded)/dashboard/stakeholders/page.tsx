import MemberModal from "@/components/stakeholder/member-modal";
import { MemberCard } from "@/components/stakeholder/member-card";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { withServerSession } from "@/server/auth";
import { getMembers, type TypeGetMembers } from "@/server/stakeholder";

const StakeholdersPage = async () => {
  const session = await withServerSession();
  const members = await getMembers(session.user.companyId);
  const currentMembers: TypeGetMembers = [];
  const invitedMembers: TypeGetMembers = [];

  for (const member of members) {
    if (member.isOnboarded && member.status === "accepted") {
      currentMembers.push(member);
    } else {
      invitedMembers.push(member);
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex  items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h2 className="text-xl font-medium">Stakeholders</h2>
          <p className="text-sm text-muted-foreground">
            Manage your company{`'`}s stakeholders
          </p>
        </div>

        <div>
          <MemberModal
            title="Add a stakeholder"
            subtitle="Invite a stakeholder to your company."
            member={{
              name: "",
              email: "",
              title: "",
              access: "stakeholder",
            }}
          >
            <Button className="w-full md:w-auto">Invite a stakeholder</Button>
          </MemberModal>
        </div>
      </div>
      <Separator />
      <div>
        <Tabs defaultValue="active">
          <div className="pb-4">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="invited">Pending</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="active">
            <div className="flex flex-col gap-y-6">
              {currentMembers.length
                ? currentMembers.map((item) => (
                    <MemberCard
                      key={item.id}
                      name={item.user?.name}
                      email={item.user?.email}
                      status={item.status}
                      userEmail={session.user.email}
                      membershipId={item.id}
                    />
                  ))
                : null}
            </div>
          </TabsContent>
          <TabsContent value="invited">
            <div className="flex flex-col gap-y-6">
              {invitedMembers.length
                ? invitedMembers.map((item) => (
                    <MemberCard
                      key={item.id}
                      name={item.user?.name}
                      email={item.invitedEmail}
                      status={item.status}
                      userEmail={session.user.email}
                      membershipId={item.id}
                    />
                  ))
                : null}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StakeholdersPage;
