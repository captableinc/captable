import { AccessRequestForm } from "@/components/documents/share/access-request-form";
import { DocumentOTPForm } from "@/components/documents/share/document-otp-form";
import { db } from "@/server/db";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { notFound } from "next/navigation";
import { DocumentSharePdfViewer } from "./document-share-pdf-viewer";

const DocumentSharePublicPage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  const documentShare = await db.documentShare.findFirst({
    where: {
      publicId,
    },
  });

  if (!documentShare) {
    return notFound();
  }

  if (documentShare.emailProtected) {
    return (
      <div className="grid h-screen w-full place-items-center bg-gray-100">
        <AccessRequestForm publicId={publicId} />
        <DocumentOTPForm />
      </div>
    );
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
