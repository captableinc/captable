import { getPresignedGetUrl } from "@/server/file-uploads";
import { db } from "@/server/db";
import { DocumentOTPForm } from "@/components/document/share/document-otp-form";
import { DocumentSharePdfViewer } from "./document-share-pdf-viewer";
import { notFound } from "next/navigation";

const DocumentSharePublicPage = async ({
  params: { documentId },
}: {
  params: { documentId: string };
}) => {
  const documentShare = await db.documentShare.findFirst({
    where: {
      id: documentId,
    },
  });

  if (!documentShare) {
    return notFound();
  }

  const document = await db.document.findFirst({
    where: {
      id: documentShare.documentId,
    },
    select: {
      bucket: {
        select: {
          key: true,
        },
      },
    },
  });

  if (!document) {
    return notFound();
  }

  const { url } = await getPresignedGetUrl(document.bucket.key);
  return (
    <div className="grid h-screen w-full bg-gray-100">
      <DocumentSharePdfViewer url={url} />
    </div>
  );
};

export default DocumentSharePublicPage;
