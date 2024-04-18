import DocumentViewer from "@/components/documents/common/viewer";
import { withServerSession } from "@/server/auth";
import { db } from "@/server/db";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { notFound } from "next/navigation";

const DocumentPreview = async ({
  params: { publicId, bucketId },
}: {
  params: { publicId: string; bucketId: string };
}) => {
  const session = await withServerSession();
  const companyId = session?.user?.companyId;
  const document = await db.document.findFirst({
    where: {
      bucketId,
      companyId,
    },

    include: { bucket: true },
  });

  if (!document || !document.bucket) {
    return notFound();
  }

  const file = document.bucket;
  const remoteFile = await getPresignedGetUrl(file.key);

  return <DocumentViewer file={file} link={remoteFile.url} />;
};

export default DocumentPreview;
