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
  const buffer = await fetch(remoteFile.url).then((res) => res.arrayBuffer());
  const blob = new Blob([buffer], { type: file.mimeType });
  const blobText = URL.createObjectURL(blob);

  // console.log({ blobText })

  // return (
  //   <>File</>
  // )

  return <DocumentViewer uri={blobText} type={file.mimeType} />;
};

export default DocumentPreview;
