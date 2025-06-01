import EmptyState from "@/components/common/empty-state";
import { PageLayout } from "@/components/dashboard/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { useServerSideSession } from "@/hooks/use-server-side-session";
import { serverAccessControl } from "@/server/member";
import { api } from "@/trpc/server";
import { RiAddFill, RiUploadCloudLine } from "@remixicon/react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import DocumentsTable from "./components/table";
import { DocumentUploadButton } from "./document-upload-button";

export const metadata: Metadata = {
  title: "Documents",
};

const DocumentsPage = async () => {
  const headersList = await headers();
  const { allow } = await serverAccessControl({ headers: headersList });
  const session = await useServerSideSession({ headers: headersList });

  const documents = await allow(api.document.getAll.query(), [
    "documents",
    "read",
  ]);

  const canUpload = allow(true, ["documents", "read"]);

  if (!documents) {
    return <UnAuthorizedState />;
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
            companyPublicId={session?.user?.companyPublicId ?? ""}
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
              companyPublicId={session?.user?.companyPublicId ?? ""}
              buttonDisplayName="Document"
            />
          ) : null
        }
      />
      <Card className="mt-3">
        <div className="p-6">
          <DocumentsTable
            companyPublicId={session?.user?.companyPublicId ?? ""}
            documents={documents}
          />
        </div>
      </Card>
    </div>
  );
};

export default DocumentsPage;
