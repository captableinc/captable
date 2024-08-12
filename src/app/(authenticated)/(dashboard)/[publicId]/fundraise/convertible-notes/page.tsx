import EmptyState from "@/components/common/empty-state";

import { RiPieChartFill } from "@remixicon/react";
import type { Metadata } from "next";
import { AddConvertibleNotesButton } from "./components/add-convertible-notes-button";

export const metadata: Metadata = {
  title: "Convertible notes",
};

const ConvertibleNotesPage = () => {
  return (
    <EmptyState
      icon={<RiPieChartFill />}
      title="Create and manage convertible notes."
      subtitle="Please click the button for creating convertible notes."
    >
      <AddConvertibleNotesButton />
    </EmptyState>
  );
};

export default ConvertibleNotesPage;
