"use client";

import SafeDocument from "@/components/safe/document";
import { Card } from "@/components/ui/card";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { BlobProvider, usePDF } from "@react-pdf/renderer";

const PreviewSafePage = () => {
  // const [instance, updateInstance] = usePDF({ document: <SafeDocument /> });

  // if (instance.loading) return <div>Loading ...</div>;

  // if (instance.error) return <div>Something went wrong: {instance.error}</div>;
  return (
    <>
      {/* <article className="prose">
        <SafeDocument />
      </article> */}
      <BlobProvider
        document={
          <SafeDocument
            investor={"Puru Dahal"}
            investment={10000}
            valuation={5000000}
            date={"07/13/2024"}
            company={{
              name: "Captable, Inc.",
              state: "DE",
            }}
          />
        }
      >
        {({ blob, url, loading, error }) => {
          if (loading) return <div>Loading ...</div>;
          if (error) return <div>Something went wrong: {error.toString()}</div>;
          return (
            <>
              <PdfViewer file={url} />

              <br />
              <br />
              <a href={url as string} download="test.pdf">
                Download
              </a>
            </>
          );
        }}
      </BlobProvider>
    </>
  );
};

export default PreviewSafePage;
