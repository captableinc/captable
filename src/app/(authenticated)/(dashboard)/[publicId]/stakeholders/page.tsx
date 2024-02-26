import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiAddFill, RiGroup2Fill } from "@remixicon/react";
import StakeholderModal from "./modal";
import Tldr from "@/components/shared/tldr";

const StakeholderPage = async () => {
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
            message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto esse id quibusdam nihil ullam eos temporibus explicabo ipsa!."
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
};

export default StakeholderPage;
