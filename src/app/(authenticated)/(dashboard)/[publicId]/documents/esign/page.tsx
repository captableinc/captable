import { AddEsignModal } from "@/components/esign/add-esign-modal";
import { withServerSession } from "@/server/auth";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
};

const EsignDocumentPage = async () => {
  const session = await withServerSession();

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">E-Sign Document</h3>
          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div>
          <AddEsignModal companyPublicId={session.user.companyPublicId} />
        </div>
      </div>
    </div>
  );
};

export default EsignDocumentPage;
