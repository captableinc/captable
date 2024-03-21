import ShareModal from "@/components/securities/shares/share-modal";
import EmptyState from "@/components/shared/empty-state";
import Tldr from "@/components/shared/tldr";
import { Button } from "@/components/ui/button";
import { RiAddFill, RiGroup2Fill } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Shares",
};

const SharesPage = () => {
  return (
    <EmptyState
      icon={<RiGroup2Fill />}
      title="You do not have any options yet."
      subtitle="Please click the button for adding new options."
    >
      <ShareModal
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
            Add a share
          </Button>
        }
      />
    </EmptyState>
  );
};

export default SharesPage;
