"use client";

// import { PdfViewer } from "@/components/ui/pdf-viewer";
// import { BlobProvider } from "@react-pdf/renderer";
import SafeDocument from "@/components/safe/document";
import type { SafeProps } from "@/components/safe/templates";
import { Card } from "@/components/ui/card";
import { PDFViewer } from "@react-pdf/renderer";

const SafePreview = ({
  investor,
  investment,
  valuation,
  date,
  company,
}: SafeProps) => {
  return (
    // <BlobProvider
    //   document={
    //     <SafeDocument
    //       investor={investor}
    //       investment={investment}
    //       valuation={valuation}
    //       date={date}
    //       company={company}
    //     />
    //   }
    // >
    //   {({ blob, url, loading, error }) => {
    //     // if (loading) return <div>Loading ...</div>;
    //     // if (error) return <div>Something went wrong: {error.toString()}</div>;
    //     return (
    //       <>
    //         <PdfViewer file={url} />

    //         <br />
    //         <br />
    //         <a href={url as string} download="test.pdf">
    //           Download
    //         </a>
    //       </>
    //     );
    //   }}
    // </BlobProvider>

    <PDFViewer className="w-full h-screen border-none rounded-md">
      <SafeDocument
        investor={investor}
        investment={investment}
        valuation={valuation}
        date={date}
        company={company}
      />
    </PDFViewer>
  );
};

export default SafePreview;
