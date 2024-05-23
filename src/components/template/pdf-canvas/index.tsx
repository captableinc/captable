"use client";

import {
  PdfViewerPage,
  PdfViewerRoot,
  usePdfValue,
} from "@/components/ui/pdf-viewer";
import type { RouterOutputs } from "@/trpc/shared";

import { FieldCanvas } from "../field-canvas";
import { ReadOnlyFieldCanvas } from "../field-canvas/readonly-field-canvas";

type Recipients = RouterOutputs["template"]["get"]["recipients"];

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
        <ReadOnlyFieldCanvas pageNumber={index + 1} />
      )}
    </div>
  ));
}

export function PdfCanvas({ url, mode = "edit", recipients }: PdfCanvasProps) {
  return (
    <div className="col-span-12 select-none">
      <PdfViewerRoot
        className="w-full overflow-hidden rounded flex flex-col gap-y-6"
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
