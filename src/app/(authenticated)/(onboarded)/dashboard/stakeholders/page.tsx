import { MemberCard } from "@/components/stakeholder/member-card";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const StakeholdersPage = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col items-center justify-between gap-y-3 md:flex-row">
        <div className="gap-y-3">
          <h2 className="text-xl font-medium">Stakeholders</h2>
          <p className="text-sm text-muted-foreground">
            Teammates that have access to this project.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <Button className="w-full md:w-auto">Invite</Button>
        </div>
      </div>
      <Separator />
      <div>
        <Tabs defaultValue="members">
          <div className="pb-4">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invitation">Invitation</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="members">
            <div className="flex flex-col gap-y-6">
              <MemberCard name="micah" email="123@gmail.com" />
            </div>
          </TabsContent>
          <TabsContent value="invitation">
            <MemberCard name="micah" email="123@gmail.com" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StakeholdersPage;
