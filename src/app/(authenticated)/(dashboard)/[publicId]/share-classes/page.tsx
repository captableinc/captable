import Link from "next/link";
import { db } from "@/server/db";
import ShareClassTable from "./table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withServerSession } from "@/server/auth";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChart2Line, RiAddFill } from "@remixicon/react";

type SharesPageParams = {
  params: {
    publicId: string;
  };
};

const getShareClasses = async (companyId: string) => {
  return await db.shareClass.findMany({
    where: { companyId },
  });
};

const SharesPage = async ({ params }: SharesPageParams) => {
  const { publicId } = params;
  const session = await withServerSession();
  const companyId = session?.user?.companyId;
  let shareClasses = [];

  if (companyId) {
    shareClasses = await getShareClasses(companyId);
  }

  if (shareClasses.length === 0) {
    return (
      <EmptyState
        icon={<RiPieChart2Line />}
        title="You do not have any share classes!"
        subtitle="Please click the button below to create a new share class."
      >
        <Link href={`/${publicId}/share-classes/new`} passHref>
          <Button size="lg">
            <RiAddFill className="mr-2 h-5 w-5" />
            Create a share class
          </Button>
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Share classes</h3>
          <p className="text-sm text-muted-foreground">
            Manage the share classes for your company
          </p>
        </div>

        <div>
          <Link href={`/${publicId}/share-classes/new`} passHref>
            <Button>
              <RiAddFill className="mr-2 h-5 w-5" />
              Create a share class
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mt-3">
        <div className="p-6">
          <ShareClassTable shareClasses={shareClasses} />
        </div>
      </Card>
    </div>
  );
};

export default SharesPage;
