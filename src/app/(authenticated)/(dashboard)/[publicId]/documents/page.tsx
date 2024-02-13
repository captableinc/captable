import { db } from "@/server/db";
import DocumentsTable from "./table";
import DocumentUploadModal from "./modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withServerSession } from "@/server/auth";
import type { Document, User } from "@prisma/client";
import EmptyState from "@/components/shared/empty-state";
import { RiUploadCloudLine, RiAddFill } from "@remixicon/react";

interface DocumentType extends Document {
  uploadedBy: User | null;
}

const getDocuments = async (companyId: string) => {
  return await db.document.findMany({
    where: { companyId },
    include: {
      uploadedBy: true,
    },
  });
};

const DocumentsPage = async () => {
  const session = await withServerSession();
  const companyId = session?.user?.companyId;
  const documents: DocumentType[] = await getDocuments(companyId);

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<RiUploadCloudLine />}
        title="You do not have any documents!"
        subtitle="Please click the button below to upload a new document."
      >
        <DocumentUploadModal
          trigger={
            <Button size="lg">
              <RiAddFill className="mr-2 h-5 w-5" />
              Upload a document
            </Button>
          }
        />
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
          <DocumentUploadModal
            trigger={
              <Button>
                <RiAddFill className="mr-2 h-5 w-5" />
                Upload a document
              </Button>
            }
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
