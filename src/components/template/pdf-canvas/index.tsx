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

export function PdfCanvas({ url, mode }: PdfCanvasProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [pageHeights, setPageHeights] = useState<number[]>([]);

  const onDocumentLoadSuccess = useCallback(async (e: PDFDocumentProxy) => {
    const heights: number[] = [];

    for (let index = 0; index < e.numPages; index++) {
      const page = await e.getPage(index + 1);

      const { height } = page.getViewport({ scale: 1 });

      heights.push(height);
    }

    setPageHeights(heights);

    setIsLoaded(true);
  }, []);

  return (
    <div className="relative col-span-12 select-none">
      <MemoPdfViewer onDocumentLoadSuccess={onDocumentLoadSuccess} file={url} />

      {isLoaded ? (
        mode === "edit" ? (
          <FieldCanvas pageHeights={pageHeights} mode={mode} />
        ) : (
          <ReadOnlyFieldCanvas />
        )
      ) : null}
    </div>
  );
}
