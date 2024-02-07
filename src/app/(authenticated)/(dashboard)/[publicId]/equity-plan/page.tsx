"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChart2Line, RiAddFill } from "@remixicon/react";

const SharesPage = () => {
  const params = useParams<{ publicId: string }>();
  const publicCompanyId = params.publicId;

  return (
    <EmptyState
      icon={<RiPieChart2Line />}
      title="You do not have any share classes!"
      subtitle="Please click the button below to create a new share class."
    >
      <Link href={`/${publicCompanyId}/share-classes/new`} passHref>
        <Button size="lg">
          <RiAddFill className="mr-2 h-5 w-5" />
          Create a share class
        </Button>
      </Link>
    </EmptyState>
  );
};

export default SharesPage;
