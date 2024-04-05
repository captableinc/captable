import { api } from "@/trpc/server";
import Tldr from "@/components/shared/tldr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiAddFill, RiGroup2Fill } from "@remixicon/react";
import StakeholderModal from "@/components/stakeholder/stakeholder-modal";
import StakeholderTable from "@/components/stakeholder/stakeholder-table";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Stakeholders",
};

const StakeholdersPage = async () => {
  const stakeholders = await api.stakeholder.getStakeholders.query();

  if (stakeholders.data.length === 0) {
    return (
      <EmptyState
        icon={<RiGroup2Fill />}
        title="You do not have any stakeholders!"
        subtitle="Please click the button below to add or import stakeholders."
      >
        <StakeholderModal
          title="Add or Import Stakeholders"
          subtitle={
            <Tldr
              message="Manage stakeholders by adding or importing them. 
              Categorize, assign roles, and maintain contact info for investors, partners, and clients."
              cta={{
                label: "Learn more",
                // TODO - this link should be updated to the correct URL
                href: "https://opencap.co/help",
              }}
            />
          }
          trigger={
            <Button size="lg">
              <RiAddFill className="mr-2 h-5 w-5" />
              Add stakeholders
            </Button>
          }
        />
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3">
        <div className="gap-y-3">
          <h3 className="font-medium">Stakeholders</h3>
          <p className="text-sm text-muted-foreground">
            Manage stakeholders for your company
          </p>
        </div>

        <div>
          <StakeholderModal
            title="Add or Import Stakeholders"
            subtitle={
              <Tldr
                message="Manage stakeholders by adding or importing them. 
                Categorize, assign roles, and maintain contact info for investors, partners, and clients."
                cta={{
                  label: "Learn more",
                  // TODO - this link should be updated to the correct URL
                  href: "https://opencap.co/help",
                }}
              />
            }
            trigger={
              <Button>
                <RiAddFill className="mr-2 h-5 w-5" />
                Add stakeholders
              </Button>
            }
          />
        </div>
      </div>

      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <StakeholderTable stakeholders={stakeholders.data} />
      </Card>
    </div>
  );
};

export default StakeholdersPage;
