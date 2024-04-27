import { PageLayout } from "@/components/dashboard/page-layout";
import { AddEsignModal } from "@/components/esign/add-esign-modal";
import { Card } from "@/components/ui/card";
import { withServerSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import { ESignTable } from "./components/table";

export const metadata: Metadata = {
  title: "Documents",
};

const EsignDocumentPage = async () => {
  const session = await withServerSession();
  const { documents } = await api.template.all.query();

  return (
    <PageLayout
      title="eSign documents"
      description="Upload, sign and send documents for electronic signatures."
      action={<AddEsignModal companyPublicId={session.user.companyPublicId} />}
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
