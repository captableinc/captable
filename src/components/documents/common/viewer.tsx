"use client";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import type { Bucket } from "@prisma/client";
import * as url from "url";

type DocumentViewerProps = {
  link: string;
  file: Bucket;
};

const DocumentViewer = ({ link, file }: DocumentViewerProps) => {
  const files = [{ uri: link }];

  const fileUrl = url.parse(link);
  const { protocol, host, pathname, search, query } = fileUrl;

  console.log({ link, protocol, host, pathname, search, query });

  return (
    <div className="h-screen">
      <DocViewer
        prefetchMethod="GET"
        className="rounded-lg bg-white shadow-md"
        documents={files}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
            retainURLParams: true,
          },
        }}
      />
    </div>
  );
};

export default DocumentViewer;
