"use client";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

type DocumentViewerProps = {
  uri: string;
  type: string;
};

const DocumentViewer = ({ uri, type }: DocumentViewerProps) => {
  const files = [{ fileName: "bla", uri, type }];
  return (
    <div className="h-screen">
      <DocViewer
        // prefetchMethod="GET"
        // requestHeaders={headers}
        className="rounded-lg bg-white shadow-md"
        documents={files}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
            disableHeader: false,
            disableFileName: false,
            retainURLParams: false,
          },
        }}
      />
    </div>
  );
};

export default DocumentViewer;
