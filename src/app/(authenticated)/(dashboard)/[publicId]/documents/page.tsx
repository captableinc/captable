import EmptyState from "@/components/common/empty-state";
import { PageLayout } from "@/components/dashboard/page-layout";
import { Card } from "@/components/ui/card";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { withServerComponentSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { RiUploadCloudLine } from "@remixicon/react";
import type { Metadata } from "next";
import DocumentsTable from "./components/table";
import { DocumentUploadButton } from "./document-upload-button";

export const metadata: Metadata = {
  title: "Documents",
};

const DocumentsPage = async () => {
  const { allow } = await serverAccessControl();
  const session = await withServerComponentSession();

  const documents = await allow(api.document.getAll.query(), [
    "documents",
    "read",
  ]);

  const canUpload = allow(true, ["documents", "read"]);

  if (!documents) {
    return <div>Access denied</div>;
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<RiUploadCloudLine />}
        title="You do not have any documents!"
        subtitle="Please click the button below to upload a new document."
      >
        {canUpload && (
          <DocumentUploadButton
            companyPublicId={session.user.companyPublicId}
            buttonDisplayName="Upload a document"
          />
        )}
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <PageLayout
        title="All documents"
        description="Upload documents to your company's document library."
        action={
          canUpload ? (
            <DocumentUploadButton
              companyPublicId={session.user.companyPublicId}
              buttonDisplayName="Document"
            />
          ) : null
        }
      />
      <Card className="mt-3">
        <div className="p-6">
          <DocumentsTable
            companyPublicId={session.user.companyPublicId}
            documents={documents}
          />
        </div>
      </Card>
    </div>
  );
};

export default DocumentsPage;
