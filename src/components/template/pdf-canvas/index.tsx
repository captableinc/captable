"use client";

import {
  PdfViewerPage,
  PdfViewerRoot,
  usePdfValue,
} from "@/components/ui/pdf-viewer";
import { type PageMeasurement } from "@/lib/pdf-positioning";
import { type RouterOutputs } from "@/trpc/shared";

import { useCallback, useState } from "react";
import { DocumentProps } from "react-pdf";
import { FieldCanvas } from "../field-canvas";
import { ReadOnlyFieldCanvas } from "../field-canvas/readonly-field-canvas";

type Recipients = RouterOutputs["template"]["get"]["recipients"];
type LoadCallback = Required<DocumentProps>["onLoadSuccess"];

type TRecipient =
  | {
      mode: "readonly";
      recipients?: never;
    }
  | {
      mode: "edit";
      recipients: Recipients;
    };

type PdfCanvasProps = { url: string } & TRecipient;

function PdfPages({ recipients, mode }: TRecipient) {
  const { containerWidth, numPages } = usePdfValue();
  return Array.from(new Array(numPages), (el, index) => (
    <div className="relative" key={`page_${index + 1}`}>
      <PdfViewerPage
        pageNumber={index + 1}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        width={containerWidth}
      />
      {mode === "edit" && recipients ? (
        <FieldCanvas recipients={recipients} pageNumber={index + 1} />
      ) : (
        <ReadOnlyFieldCanvas />
      )}
    </div>
  ));
}

export function PdfCanvas({ url, mode = "edit", recipients }: PdfCanvasProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [measurements, setPageHeights] = useState<PageMeasurement>([]);

  const onDocumentLoadSuccess: LoadCallback = useCallback(async (e) => {
    const measurements: PageMeasurement = [];

    for (let index = 0; index < e.numPages; index++) {
      const page = await e.getPage(index + 1);

      const { height, width } = page.getViewport({ scale: 1 });

      measurements.push({ height, width });
    }

    setPageHeights(measurements);

    setIsLoaded(true);
  }, []);

  return (
    <div className="col-span-12 select-none">
      <PdfViewerRoot
        className="w-full overflow-hidden rounded flex flex-col gap-y-6"
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        file={url}
      >
        {mode === "edit" && recipients ? (
          <PdfPages mode="edit" recipients={recipients} />
        ) : (
          <PdfPages mode="readonly" />
        )}
      </PdfViewerRoot>
    </div>
  );
}
