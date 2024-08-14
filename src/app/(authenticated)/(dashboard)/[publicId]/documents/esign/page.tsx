import EmptyState from "@/components/common/empty-state";
import { PageLayout } from "@/components/dashboard/page-layout";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { withServerComponentSession } from "@/server/auth";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { AddEsignDocumentButton } from "./components/add-esign-doc-button";
import { ESignTable } from "./components/table";

export const metadata: Metadata = {
  title: "Documents",
};

const EsignDocumentPage = async () => {
  const session = await withServerComponentSession();
  const { documents } = await api.template.all.query();

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="upload-cloud-line" />}
        title="You do not have any documents!"
        subtitle="Click the button below to upload a new document for electronic signature."
      >
        <AddEsignDocumentButton
          title="esign a Document"
          subtitle=""
          companyPublicId={session.user.companyPublicId}
        />
      </EmptyState>
    );
  }

  return (
    <PageLayout
      title="eSign documents"
      description="Upload, sign and send documents for electronic signatures."
      action={
        <AddEsignDocumentButton
          title="esign a Document"
          subtitle=""
          companyPublicId={session.user.companyPublicId}
        />
      }
    >
      <Card className="mt-3">
        <div className="p-6">
          <ESignTable
            companyPublicId={session.user.companyPublicId}
            documents={documents}
          />
        </div>
      </Card>
    </PageLayout>
  );
};

export default EsignDocumentPage;
