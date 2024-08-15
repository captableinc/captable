import EmptyState from "@/components/common/empty-state";

import { PageLayout } from "@/components/dashboard/page-layout";
import { Card } from "@/components/ui/card";
import { getManyConvertibleNote } from "@/server/api/client-handlers/convertible-note";
import { withServerSession } from "@/server/auth";
import { RiPieChartFill } from "@remixicon/react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { AddConvertibleNotesButton } from "./components/add-convertible-notes-button";
import { ConvertibleNotesTable } from "./components/convertible-notes-table";

export const metadata: Metadata = {
  title: "Convertible notes",
};

const ConvertibleNotesPage = async () => {
  // const session = await withServerSession();
  const notes = await getManyConvertibleNote({
    searchParams: {
      limit: 50,
    },
    urlParams: { companyId: "clzjkpjne0005kpdrg9ibpg9x" },
    headers: headers(),
  });

  if (!notes?.data?.length) {
    return (
      <EmptyState
        icon={<RiPieChartFill />}
        title="Create and manage convertible notes."
        subtitle="Please click the button for creating convertible notes."
      >
        <AddConvertibleNotesButton />
      </EmptyState>
    );
  }
  return (
    <PageLayout
      title="Convertible notes"
      description="Create and manage convertible notes."
      action={<AddConvertibleNotesButton />}
    >
      <Card className="mt-3">
        <div className="p-6">
          <ConvertibleNotesTable notes={notes.data} />
        </div>
      </Card>
    </PageLayout>
  );
};

export default ConvertibleNotesPage;
