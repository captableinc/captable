import MultistepShareModal from "@/components/securities/shares/MultistepShareModal";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { RiAddFill, RiDonutChartFill } from "@remixicon/react";

const SharesPage = () => {
  return (
    <EmptyState
      icon={<RiDonutChartFill />}
      title="You do not have any shares!"
      subtitle="Please click the button below to add shares."
    >
      <MultistepShareModal
        title="Shares"
        subtitle="this is a subtitle"
        trigger={
          <Button size="lg">
            <RiAddFill className="mr-2 h-5 w-5" />
            Add shares
          </Button>
        }
      />
    </EmptyState>
  );
};

export default SharesPage;
