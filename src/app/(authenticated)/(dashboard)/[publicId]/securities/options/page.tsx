import OptionModal from "@/components/securities/options/option-modal";
import OptionTable from "@/components/securities/options/option-table";
import EmptyState from "@/components/shared/empty-state";
import Tldr from "@/components/shared/tldr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { RiAddFill, RiGroup2Fill } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Options",
};

const OptionsPage = async () => {
  const options = await api.securities.getOptions.query();

  if (options?.data?.length === 0) {
    return (
      <EmptyState
        icon={<RiGroup2Fill />}
        title="You do not have any options yet."
        subtitle="Please click the button for adding new options."
      >
        <OptionModal
          title="Create an option"
          subtitle={
            <Tldr
              message="Please fill in the details to create an option. If you need help, click the link below."
              cta={{
                label: "Learn more",
                href: "https://opencap.co/help/stakeholder-options",
              }}
            />
          }
          trigger={
            <Button size="lg">
              <RiAddFill className="mr-2 h-5 w-5" />
              Add an option
            </Button>
          }
        />
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Options</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add stock options for stakeholders
          </p>
        </div>
        <div>
          <OptionModal
            title="Collect options for Stakeholders"
            subtitle={
              <Tldr
                message="Manage stock options by adding them. 
               Add approval dates, notes, grantId for the stakeholders. "
                cta={{
                  label: "Learn more",
                  href: "https://opencap.co/help/stakeholder-options",
                }}
              />
            }
            trigger={<Button>Add Options</Button>}
          />
        </div>
      </div>
      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <OptionTable options={options.data} />
      </Card>
    </div>
  );
};

export default OptionsPage;
