import FileIcon from "@/components/common/file-icon";
import FilePreview from "@/components/file/preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useServerSideSession } from "@/hooks/use-server-side-session";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { and, buckets, db, documents, eq } from "@captable/db";
import { RiArrowLeftSLine } from "@remixicon/react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

const DocumentPreview = async ({
  params,
}: {
  params: Promise<{ publicId: string; bucketId: string }>;
}) => {
  const { publicId, bucketId } = await params;
  const session = await useServerSideSession({ headers: await headers() });
  const companyId = session?.user?.companyId;
  const document = await db
    .select({
      id: documents.id,
      publicId: documents.publicId,
      name: documents.name,
      bucketId: documents.bucketId,
      uploaderId: documents.uploaderId,
      companyId: documents.companyId,
      shareId: documents.shareId,
      optionId: documents.optionId,
      safeId: documents.safeId,
      convertibleNoteId: documents.convertibleNoteId,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
      bucket: {
        id: buckets.id,
        name: buckets.name,
        key: buckets.key,
        mimeType: buckets.mimeType,
        size: buckets.size,
        tags: buckets.tags,
        createdAt: buckets.createdAt,
        updatedAt: buckets.updatedAt,
      },
    })
    .from(documents)
    .innerJoin(buckets, eq(documents.bucketId, buckets.id))
    .where(
      and(
        eq(documents.bucketId, bucketId),
        eq(documents.companyId, companyId as string),
      ),
    )
    .limit(1)
    .then((results) => results[0] || null);

  if (!document || !document.bucket) {
    return notFound();
  }

  const file = document.bucket;
  const remoteFile = await getPresignedGetUrl(file.key);

  return (
    <Fragment>
      <div className="mb-5 flex">
        <Link href={`/${publicId}/documents`}>
          <Button
            variant="outline"
            size="icon"
            className="-mt-1 mr-3 flex items-center rounded-full"
          >
            <RiArrowLeftSLine className="h-5 w-5" />
          </Button>
        </Link>

        <FileIcon type={file.mimeType} />

        <h1 className="ml-3 text-2xl font-semibold tracking-tight">
          <span className="text-primary/60">{file.name}</span>
        </h1>
      </div>

      <Card className="p-5">
        <FilePreview
          name={file.name}
          url={remoteFile.url}
          mimeType={file.mimeType}
        />
      </Card>
    </Fragment>
  );
};

export default DocumentPreview;
