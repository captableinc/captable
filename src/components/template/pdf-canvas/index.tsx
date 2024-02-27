"use client";

import { PdfViewer } from "@/components/ui/pdf-viewer";
import { FieldCanvas } from "../field-canvas";
import { memo, useCallback, useState } from "react";

interface PdfCanvasProps {
  url: string;
  mode?: "readonly" | "edit";
}

const MemoPdfViewer = memo(PdfViewer);

export function PdfCanvas({ url, mode }: PdfCanvasProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const onSuccess = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative col-span-12 select-none">
      <MemoPdfViewer onSuccess={onSuccess} file={url} />

      {isLoaded ? <FieldCanvas mode={mode} /> : null}
    </div>
  );
}
