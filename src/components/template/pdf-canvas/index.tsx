"use client";

import { PdfViewer } from "@/components/ui/pdf-viewer";
import { FieldCanvas } from "../field-canvas";
import { memo, useCallback, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { ReadOnlyFieldCanvas } from "../field-canvas/readonly-field-canvas";

interface PdfCanvasProps {
  url: string;
  mode?: "readonly" | "edit";
}

const MemoPdfViewer = memo(PdfViewer);

export function PdfCanvas({ url, mode = "edit" }: PdfCanvasProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [measurements, setPageHeights] = useState<
    { height: number; width: number }[]
  >([]);

  const onDocumentLoadSuccess = useCallback(async (e: PDFDocumentProxy) => {
    const measurements: { height: number; width: number }[] = [];

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
        mode === "edit" ? (
          <FieldCanvas measurements={measurements} mode={mode} />
        ) : (
          <ReadOnlyFieldCanvas />
        )
      ) : null}
    </div>
  );
}
