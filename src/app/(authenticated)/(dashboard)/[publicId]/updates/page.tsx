import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiMailSendLine, RiAddFill } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Updates",
};

const UpdatesPage = ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  return (
    <EmptyState
      icon={<RiMailSendLine />}
      title="You have not sent any updates."
      subtitle="Please click the button below to send an update to your stakeholders."
    >
      <Link href={`/${publicId}/updates/new`} passHref>
        <Button size="lg" asChild>
          <RiAddFill className="mr-2 h-5 w-5" />
          Draft an update
        </Button>
      </Link>
    </EmptyState>
  );
};

export default UpdatesPage;
