import { Card } from "@/components/ui/card";
import DocumentsTable from "./table";

import { AddDocumentsDropdown } from "@/components/documents/add-documents-dropdown";
import EmptyState from "@/components/shared/empty-state";
import { withServerSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { RiUploadCloudLine } from "@remixicon/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
};

const DocumentsPage = async () => {
  const documents = await api.document.getAll.query();
  const session = await withServerSession();

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<RiUploadCloudLine />}
        title="You do not have any documents!"
        subtitle="Please click the button below to upload a new document."
      >
        <AddDocumentsDropdown companyPublicId={session.user.companyPublicId} />
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Documents</h3>
          <p className="text-sm text-muted-foreground">
            Templates, agreements, and other important documents
          </p>
        </div>

        <div>
          <AddDocumentsDropdown
            companyPublicId={session.user.companyPublicId}
          />
        </div>
      </div>

      <Card className="mt-3">
        <div className="p-6">
          <DocumentsTable documents={documents} />
        </div>
      </Card>
    </div>
  );
};

export default DocumentsPage;
