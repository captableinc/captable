import { db } from "@/server/db";
import DocumentsTable from "./table";
import DocumentUploadModal from "./modal";
import { Card } from "@/components/ui/card";
import Uploader from "@/components/ui/uploader";
import { withServerSession } from "@/server/auth";
import { RiUploadCloudLine } from "@remixicon/react";

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
  const documents = await getDocuments(companyId);

  if (documents.length === 0) {
    return (
      <div className="w-full">
        <Uploader
          header={
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <span className="text-teal-500">
                  <RiUploadCloudLine />
                </span>
              </div>

              <h3 className="mb-5 text-3xl font-semibold">
                You do not have any documents yet.
              </h3>
            </>
          }
        />
      </div>
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
          <DocumentUploadModal />
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
