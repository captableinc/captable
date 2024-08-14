import EmptyState from "@/components/common/empty-state";
import { PageLayout } from "@/components/dashboard/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { withServerComponentSession } from "@/server/auth";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import DocumentUploadModal from "../components/modal";
import DocumentsTable from "../components/table";

export const metadata: Metadata = {
  title: "Documents",
};

const DocumentsPage = async () => {
  const documents = await api.document.getAll.query();
  const session = await withServerComponentSession();

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="upload-cloud-line" />}
        title="You do not have any documents!"
        subtitle="Please click the button below to upload a new document."
      >
        <DocumentUploadModal
          companyPublicId={session.user.companyPublicId}
          trigger={
            <Button>
              <Icon name="add-fill" className="mr-2 h-5 w-5" />
              Upload a document
            </Button>
          }
        />
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <PageLayout
        title="Share documents"
        description="Share pitch decks, financials, and any other important documents."
        action={
          <DocumentUploadModal
            companyPublicId={session.user.companyPublicId}
            trigger={
              <Button>
                <Icon name="add-fill" className="mr-2 h-5 w-5" />
                Document
              </Button>
            }
          />
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
