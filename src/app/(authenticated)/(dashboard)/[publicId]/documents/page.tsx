import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { RiUploadCloudLine } from "@remixicon/react";

const DocumentsPage = () => {
  return (
    <EmptyState
      icon={<RiUploadCloudLine />}
      title="You do not have any documents yet."
      subtitle="Please click the button below to upload a document!"
    >
      <Button size="lg">Upload a document</Button>
    </EmptyState>
  );
};

export default DocumentsPage;
