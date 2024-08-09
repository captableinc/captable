import FileIcon from "@/components/common/file-icon";
import FilePreview from "@/components/file/preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { withServerComponentSession } from "@/server/auth";
import { db } from "@/server/db";
import { getPresignedGetUrl } from "@/server/file-uploads";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

const DocumentPreview = async ({
  params: { publicId, bucketId },
}: {
  params: { publicId: string; bucketId: string };
}) => {
  const session = await withServerComponentSession();
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

  return (
    <Fragment>
      <div className="mb-5 flex">
        <Link href={`/${publicId}/documents`}>
          <Button
            variant="outline"
            size="icon"
            className="-mt-1 mr-3 flex items-center rounded-full"
          >
            <Icon name="arrow-left-s-line" size="md" />
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
