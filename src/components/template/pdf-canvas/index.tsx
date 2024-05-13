"use client";

import { PdfViewer } from "@/components/ui/pdf-viewer";
import { type PageMeasurement } from "@/lib/pdf-positioning";
import { type RouterOutputs } from "@/trpc/shared";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { memo, useCallback, useState } from "react";
import { FieldCanvas } from "../field-canvas";
import { ReadOnlyFieldCanvas } from "../field-canvas/readonly-field-canvas";

type Recipients = RouterOutputs["template"]["get"]["recipients"];

type PdfCanvasProps =
  | {
      mode: "readonly";
      url: string;
      recipients?: never;
    }
  | {
      mode: "edit";
      url: string;
      recipients: Recipients;
    };

const MemoPdfViewer = memo(PdfViewer);

export function PdfCanvas({ url, mode = "edit", recipients }: PdfCanvasProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [measurements, setPageHeights] = useState<PageMeasurement>([]);

  const onDocumentLoadSuccess = useCallback(async (e: PDFDocumentProxy) => {
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
    <div className="relative col-span-12 select-none">
      <MemoPdfViewer onDocumentLoadSuccess={onDocumentLoadSuccess} file={url} />

      {isLoaded ? (
        mode === "edit" && recipients ? (
          <FieldCanvas
            recipients={recipients}
            measurements={measurements}
            mode={mode}
          />
        ) : (
          <ReadOnlyFieldCanvas />
        )
      ) : null}
    </div>
  );
}
